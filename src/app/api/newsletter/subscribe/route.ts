import { render } from '@react-email/components';
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
 * Verifies the proof-of-work solution from the client
 */
async function verifyAltcha(payload: string): Promise<boolean> {
  try {
    // Validate ALTCHA_HMAC_SECRET environment variable
    const hmacKey = altchaHmacSecret;

    if (!hmacKey) {
      return false;
    }

    // Mindestlänge für gültiges Base64-JSON Payload
    if (!payload || payload.length < 100) {
      return false;
    }

    // Prüfe ob es sich um gültiges Base64-JSON handelt
    try {
      const decoded = atob(payload);
      JSON.parse(decoded);
    } catch {
      return false;
    }

    // Import verifySolution from altcha-lib for server-side verification
    const { verifySolution } = await import('altcha-lib');

    // Verify the ALTCHA solution with signature and expiration check
    const isValid = await verifySolution(payload, hmacKey, true);

    return isValid;
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
  } catch {
    // Best-effort cleanup — do not throw, unsubscribe still matters
    // eslint-disable-next-line no-console
    console.error('Failed to clean up subscriber after email delivery failure');
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
    // Create AbortController with 10s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Generate confirmation URL with token
      const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

      // Render email template
      const emailHtml = await render(ConfirmSubscriptionEmail({ confirmUrl }));

      // Send email via Strapi email plugin
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
  } catch {
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

    const body = await request.json();

    // Validate input with Zod schema
    const validation = newsletterSubscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, altcha, privacy } = validation.data;

    // Verify privacy policy acceptance (GDPR requirement)
    if (!privacy) {
      return NextResponse.json(
        { error: 'Please accept the privacy policy' },
        { status: 400 },
      );
    }

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
    // GDPR: Prevents user enumeration attack
    if (!subscriber) {
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
  } catch {
    return NextResponse.json(
      { error: 'An internal error occurred' },
      { status: 500 },
    );
  }
}
