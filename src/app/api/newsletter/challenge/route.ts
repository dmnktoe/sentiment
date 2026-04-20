import { createChallenge, randomInt } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { NextResponse } from 'next/server';

import { altchaHmacSecret } from '@/constant/env';

export async function GET() {
  try {
    const hmacKey = altchaHmacSecret;

    if (!hmacKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const challenge = await createChallenge({
      algorithm: 'PBKDF2/SHA-256',
      cost: 5_000,
      counter: randomInt(5_000, 10_000),
      deriveKey,
      hmacSignatureSecret: hmacKey,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return NextResponse.json(challenge);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 },
    );
  }
}
