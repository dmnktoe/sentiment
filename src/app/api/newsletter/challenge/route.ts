import { createChallenge } from 'altcha-lib';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Validate ALTCHA_SECRET environment variable
    const hmacKey = process.env.ALTCHA_SECRET;

    if (!hmacKey) {
      console.error('ALTCHA_SECRET environment variable is not set');
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
  } catch (error) {
    console.error('Challenge generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 },
    );
  }
}
