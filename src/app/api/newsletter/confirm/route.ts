import { NextResponse } from 'next/server';

async function confirmSubscription(token: string): Promise<boolean> {
  try {
    // Strapi API-Aufruf um Subscriber zu bestätigen
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

    return response.ok;
  } catch (error) {
    console.error('Confirm subscription error:', error);
    return false;
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

    const success = await confirmSubscription(token);

    if (success) {
      return NextResponse.redirect(new URL('/newsletter/success', request.url));
    } else {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=invalid-token', request.url),
      );
    }
  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.redirect(
      new URL('/newsletter/error?reason=server-error', request.url),
    );
  }
}
