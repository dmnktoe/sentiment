import { NextResponse } from 'next/server';

import { cmsApiToken, cmsApiUrl } from '@/constant/env';

/**
 * Confirm subscription endpoint helper
 * Performs the PUT against Strapi to confirm a subscriber token.
 */
export async function confirmSubscription(token: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Strapi API call to confirm subscriber (token is URL-encoded)
    const response = await fetch(
      `${cmsApiUrl}/api/subscribers/confirm?token=${encodeURIComponent(token)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cmsApiToken}`,
        },
        signal: controller.signal,
      },
    );

    // propagate network errors and return boolean for API result
    return response.ok;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Distinguish between missing token parameter and empty token value
    if (!searchParams.has('token')) {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=missing-token', request.url),
      );
    }

    const token = searchParams.get('token') ?? '';

    if (!token) {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=invalid-token', request.url),
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
