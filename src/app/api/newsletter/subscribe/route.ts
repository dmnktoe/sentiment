import { verifySolution } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { deriveHmacKeySecret } from 'altcha-lib/frameworks/shared';
import { NextResponse } from 'next/server';

import { createSubscriber, ListmonkError } from '@/lib/listmonk';
import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import { altchaHmacSecret, listmonkListId } from '@/constant/env';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 3;

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

async function verifyAltcha(payload: string): Promise<boolean> {
  try {
    const hmacSignatureSecret = altchaHmacSecret;

    if (!hmacSignatureSecret || !payload || payload.length < 100) {
      return false;
    }

    let parsed: { challenge?: unknown; solution?: unknown };
    try {
      parsed = JSON.parse(atob(payload));
    } catch {
      return false;
    }

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

export async function POST(request: Request) {
  try {
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

    const validation = newsletterSubscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, altcha } = validation.data;

    const isValidCaptcha = await verifyAltcha(altcha);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'Bot verification failed' },
        { status: 400 },
      );
    }

    try {
      await createSubscriber({ email, listIds: [listId] });
    } catch (err) {
      if (err instanceof ListmonkError && err.status === 409) {
        return NextResponse.json({
          message:
            'Thank you! If the email address is not yet registered, you will receive a confirmation email.',
        });
      }

      if (err instanceof ListmonkError && err.status === 400) {
        // eslint-disable-next-line no-console
        console.error('Newsletter subscribe: listmonk validation error', err);
        return NextResponse.json(
          { error: 'An internal error occurred' },
          { status: 500 },
        );
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
