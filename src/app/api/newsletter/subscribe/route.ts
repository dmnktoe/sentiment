import { render } from '@react-email/components';
import type {
  Challenge as AltchaChallenge,
  Solution as AltchaSolution,
} from 'altcha-lib';
import { NextResponse } from 'next/server';

import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import {
  altchaHmacSecret,
  cmsApiToken,
  cmsApiUrl,
  siteUrl,
} from '@/constant/env';
import ConfirmSubscriptionEmail from '@/emails/confirm-subscription';

// In-Memory Rate-Limiting (pro IP, 3 Versuche pro Stunde)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Padding applied to the duplicate-email branch so its response latency is
 * comparable to the happy path (create subscriber + send confirmation email).
 * Without this, an attacker could infer whether an email is already registered
 * by measuring how fast the endpoint responds. 750 ms mirrors a typical Strapi
 * round trip + email render on cloud infra.
 */
const DUPLICATE_RESPONSE_PADDING_MS = 750;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 Stunde
  const maxRequests = 3;

  // Prune expired entries to prevent unbounded memory growth
  rateLimitMap.forEach((value, key) => {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  });

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * ALTCHA Payload Verification
 * Verifies the proof-of-work solution from the client.
 *
 * The widget encodes its response as `btoa(JSON.stringify({ challenge, solution }))`,
 * matching the altcha-lib v2 `verifySolution` input shape.
 */
async function verifyAltcha(payload: string): Promise<boolean> {
  const hmacKey = altchaHmacSecret;

  if (!hmacKey) {
    return false;
  }

  if (!payload || payload.length < 100) {
    return false;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(atob(payload));
  } catch {
    return false;
  }

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed) ||
    !('challenge' in parsed) ||
    !('solution' in parsed) ||
    typeof (parsed as { challenge: unknown }).challenge !== 'object' ||
    typeof (parsed as { solution: unknown }).solution !== 'object' ||
    (parsed as { challenge: unknown }).challenge === null ||
    (parsed as { solution: unknown }).solution === null
  ) {
    return false;
  }

  const { challenge, solution } = parsed as {
    challenge: AltchaChallenge;
    solution: AltchaSolution;
  };

  try {
    const { verifySolution } = await import('altcha-lib');
    const { deriveKey } = await import('altcha-lib/algorithms/pbkdf2');

    const result = await verifySolution({
      challenge,
      solution,
      deriveKey,
      hmacSignatureSecret: hmacKey,
    });

    return result.verified && !result.expired;
  } catch {
    return false;
  }
}

/**
 * Create subscriber in Strapi database
 * GDPR: Data minimization - only stores email and confirmation token
 */
interface Subscriber {
  email: string;
  token: string;
  confirmed: boolean;
  status: 'active' | 'unsubscribed';
}

async function createSubscriber(email: string): Promise<Subscriber | null> {
  const token = crypto.randomUUID();

  // Create AbortController with 10s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Call Strapi API to create subscriber
    const response = await fetch(`${cmsApiUrl}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cmsApiToken}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        data: {
          email,
          token,
          confirmed: false, // Requires confirmation (double opt-in)
          status: 'active',
        },
      }),
    });

    if (!response.ok) {
      // Return null only for known duplicate/validation responses
      if (response.status === 400 || response.status === 409) {
        return null;
      }
      // All other errors (5xx, auth failures, etc.) bubble up to the POST handler
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `Strapi responded with ${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ''}`,
      );
    }

    const data = await response.json();

    // Strapi v5 returns data directly (not in attributes)
    // null here means a Strapi-internal issue, not a duplicate — treat as error
    if (!data.data) {
      throw new Error('Strapi returned empty data after creating subscriber');
    }

    // Use the token we generated, as Strapi might not return it (if marked private)
    return {
      email: data.data.email,
      token: data.data.token || token, // Fallback to generated token
      confirmed: data.data.confirmed,
      status: data.data.status,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Delete a subscriber by token — called when confirmation email fails
 * GDPR: Prevents orphaned unconfirmed records that block future retries
 */
async function deleteSubscriberByToken(token: string): Promise<void> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      await fetch(
        `${cmsApiUrl}/api/subscribers/by-token?token=${encodeURIComponent(token)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cmsApiToken}`,
          },
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    // Best-effort cleanup — do not throw. Log so operators notice orphans.
    // eslint-disable-next-line no-console
    console.error(
      '[newsletter/subscribe] failed to clean up subscriber after email delivery failure:',
      error,
    );
  }
}

/**
 * Send double opt-in confirmation email
 * GDPR Compliant: User must explicitly confirm subscription
 */
async function sendConfirmationEmail(
  email: string,
  token: string,
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Links point at interstitial pages (not directly at the API) so email
      // scanners / link previewers cannot silently consume the token via GET.
      const encodedToken = encodeURIComponent(token);
      const confirmUrl = `${siteUrl}/newsletter/confirm?token=${encodedToken}`;
      const rejectUrl = `${siteUrl}/newsletter/reject?token=${encodedToken}`;

      const emailHtml = await render(
        ConfirmSubscriptionEmail({ confirmUrl, rejectUrl }),
      );

      const response = await fetch(`${cmsApiUrl}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cmsApiToken}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          to: email,
          subject: 'Confirm your newsletter subscription',
          html: emailHtml,
        }),
      });

      return response.ok;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      '[newsletter/subscribe] confirmation email send failed:',
      error,
    );
    return false;
  }
}

/**
 * Newsletter subscription endpoint
 * Implements double opt-in and GDPR compliance:
 * - Bot protection (ALTCHA)
 * - Data minimization (only email)
 * - Explicit consent (privacy checkbox)
 * - Double opt-in (email confirmation)
 * - Right to be forgotten (unsubscribe link in every email)
 */
export async function POST(request: Request) {
  try {
    // Rate-Limiting per IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    // Guard: siteUrl is required to build confirmation email links.
    // If missing, emails would contain "undefined/api/..." links.
    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Missing site configuration' },
        { status: 500 },
      );
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validation = newsletterSubscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 },
      );
    }

    // Privacy consent is enforced by the schema (privacy === true)
    const { email, altcha } = validation.data;

    // Verify ALTCHA solution (bot protection)
    const isValidCaptcha = await verifyAltcha(altcha);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Bot verification failed' },
        { status: 400 },
      );
    }

    // Create subscriber (unconfirmed)
    const subscriber = await createSubscriber(email);

    // Silent failure if email already exists
    // GDPR: Prevents user enumeration attack.
    // Timing: pad the response so duplicates return in roughly the same time
    // as the happy path, which otherwise spends ~1 extra Strapi round trip
    // sending the confirmation email.
    if (!subscriber) {
      await delay(DUPLICATE_RESPONSE_PADDING_MS);
      return NextResponse.json({
        message:
          'Thank you! If the email address is not yet registered, you will receive a confirmation email.',
      });
    }

    // Send double opt-in confirmation email with error handling
    const emailSent = await sendConfirmationEmail(email, subscriber.token);

    // If email failed, delete the subscriber so the user can retry later
    // GDPR: Prevents orphaned unconfirmed records that can never be confirmed
    if (!emailSent) {
      await deleteSubscriberByToken(subscriber.token);
      return NextResponse.json(
        {
          error: 'Email could not be sent. Please try again later.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message:
        'Thank you! Please check your inbox and confirm your subscription.',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/subscribe] unhandled error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred' },
      { status: 500 },
    );
  }
}
