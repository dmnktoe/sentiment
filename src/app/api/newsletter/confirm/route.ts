import { NextResponse } from 'next/server';

/**
 * Confirm subscription endpoint
 * Handles email confirmation link clicks for double opt-in
 * GDPR Compliant: User explicitly confirms subscription
 */
async function confirmSubscription(token: string): Promise<boolean> {
  try {
    // Strapi API call to confirm subscriber
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/api/subscribers/confirm?token=${token}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate token parameter
    if (!token) {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=missing-token', request.url),
      );
    }

    // Confirm the subscription
    const success = await confirmSubscription(token);

    if (success) {
      // Redirect to success page
      return NextResponse.redirect(new URL('/newsletter/success', request.url));
    } else {
      // Redirect to error page (token invalid, already used, or expired)
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=invalid-token', request.url),
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL('/newsletter/error?reason=server-error', request.url),
    );
  }
}
