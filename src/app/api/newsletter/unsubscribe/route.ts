import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

import GoodbyeEmail from '@/emails/goodbye';

async function unsubscribeUser(
  token: string,
): Promise<{ success: boolean; email?: string }> {
  try {
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/api/subscribers/unsubscribe?token=${token}`,
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
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false };
  }
}

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
        subject: 'Newsletter-Abmeldung bestätigt',
        html: emailHtml,
      }),
    });
  } catch (error) {
    console.error('Send goodbye email error:', error);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=missing-token', request.url),
      );
    }

    const result = await unsubscribeUser(token);

    if (result.success && result.email) {
      await sendGoodbyeEmail(result.email);
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribed', request.url),
      );
    } else {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=invalid-token', request.url),
      );
    }
  } catch (error) {
    console.error('Unsubscribe route error:', error);
    return NextResponse.redirect(
      new URL('/newsletter/error?reason=server-error', request.url),
    );
  }
}
