import { createChallenge, randomInt } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { deriveHmacKeySecret } from 'altcha-lib/frameworks/shared';
import { NextResponse } from 'next/server';

import { altchaHmacSecret } from '@/constant/env';

export async function GET() {
  try {
    const hmacSignatureSecret = altchaHmacSecret;

    if (!hmacSignatureSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const hmacKeySignatureSecret =
      await deriveHmacKeySecret(hmacSignatureSecret);

    // Generate ALTCHA v2 (PoW v2) challenge for Widget v3.
    const challenge = await createChallenge({
      algorithm: 'PBKDF2/SHA-256',
      cost: 5_000,
      counter: randomInt(5_000, 10_000),
      deriveKey,
      hmacSignatureSecret,
      hmacKeySignatureSecret,
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
