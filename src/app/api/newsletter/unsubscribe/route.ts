import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

import GoodbyeEmail from '@/emails/goodbye';

/**
 * Unsubscribe user endpoint
 * GDPR Compliant: Allows users to easily opt-out at any time
 */
async function unsubscribeUser(
  token: string,
): Promise<{ success: boolean; email?: string }> {
  try {
    // URL-encode token to safely handle special characters
    const encodedToken = encodeURIComponent(token);
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/api/subscribers/unsubscribe?token=${encodedToken}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    return { success: true, email: data.email };
  } catch {
    return { success: false };
  }
}

/**
 * Send goodbye confirmation email
 * GDPR Compliant: Confirms unsubscription action
 */
async function sendGoodbyeEmail(email: string): Promise<void> {
  try {
    const emailHtml = await render(GoodbyeEmail());

    await fetch(`${process.env.STRAPI_API_URL}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        to: email,
        subject: 'Newsletter unsubscription confirmed',
        html: emailHtml,
      }),
    });
  } catch {
    // Don't throw - unsubscribe still succeeded
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

    // Unsubscribe the user
    const result = await unsubscribeUser(token);

    if (result.success) {
      // Send confirmation email (fire-and-forget with error handling)
      if (result.email) {
        sendGoodbyeEmail(result.email).catch(() => {
          // Error handling for fire-and-forget promise - user still redirected successfully
        });
      }

      // Redirect to unsubscribed confirmation page
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribed', request.url),
      );
    } else {
      // Redirect to error page
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
