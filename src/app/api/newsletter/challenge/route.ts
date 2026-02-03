import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ALTCHA Challenge generieren
    // In Production sollte dies eine richtige Challenge mit HMAC sein
    const challenge = {
      algorithm: 'SHA-256',
      challenge: Buffer.from(crypto.randomUUID()).toString('base64'),
      salt: crypto.randomUUID(),
      signature: '', // Wird vom ALTCHA Widget generiert
    };

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Challenge generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate challenge' },
      { status: 500 },
    );
  }
}
