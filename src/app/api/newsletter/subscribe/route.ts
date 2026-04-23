import { verifySolution } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { deriveHmacKeySecret } from 'altcha-lib/frameworks/nextjs';
import { NextResponse } from 'next/server';

import {
  createSubscriber,
  ListmonkError,
  sendOptInEmail,
} from '@/lib/listmonk';
import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import { altchaHmacSecret, listmonkListId } from '@/constant/env';

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
    const hmacSignatureSecret = altchaHmacSecret;

    if (!hmacSignatureSecret) {
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

    const parsed = JSON.parse(atob(payload)) as {
      challenge?: unknown;
      solution?: unknown;
    };
    if (!parsed.challenge || !parsed.solution) {
      return false;
    }

    const hmacKeySignatureSecret =
      await deriveHmacKeySecret(hmacSignatureSecret);

    const result = await verifySolution({
      challenge: parsed.challenge as never,
      solution: parsed.solution as never,
      deriveKey,
      hmacSignatureSecret,
      hmacKeySignatureSecret,
    });

    return result.verified === true;
  } catch {
    return false;
  }
}

function parseRequiredListId(raw: string | undefined): number | null {
  const n = raw ? Number(raw) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
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

    const listId = parseRequiredListId(listmonkListId);
    if (!listId) {
      return NextResponse.json(
        { error: 'Missing newsletter configuration' },
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

    try {
      const subscriber = await createSubscriber({ email, listIds: [listId] });
      await sendOptInEmail(subscriber.id);
    } catch (err) {
      // Silent failure on duplicates/validation to avoid user enumeration.
      if (
        err instanceof ListmonkError &&
        (err.status === 400 || err.status === 409)
      ) {
        return NextResponse.json({
          message:
            'Thank you! If the email address is not yet registered, you will receive a confirmation email.',
        });
      }

      // eslint-disable-next-line no-console
      console.error('Newsletter subscribe failed', err);
      return NextResponse.json(
        { error: 'An internal error occurred' },
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
