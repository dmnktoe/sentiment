import { createChallenge } from 'altcha-lib';
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

    // Generate ALTCHA challenge with proper HMAC signature
    const challenge = await createChallenge({
      hmacKey,
      maxNumber: 100000, // Maximum number for proof-of-work
      algorithm: 'SHA-256',
      expires: new Date(Date.now() + 5 * 60 * 1000), // Challenge expires in 5 minutes
    });

    return NextResponse.json(challenge);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 },
    );
  }
}
