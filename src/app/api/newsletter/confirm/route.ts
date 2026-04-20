import { NextResponse } from 'next/server';

import { cmsApiToken, cmsApiUrl } from '@/constant/env';

/**
 * Confirm subscription helper.
 * Performs the PUT against Strapi to confirm a subscriber token.
 * Errors propagate to the caller so the route can distinguish network failures
 * (server-error) from invalid/expired tokens (invalid-token).
 */
export async function confirmSubscription(token: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
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

    return response.ok;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET handler — redirects to the interstitial page. Email clients and
 * anti-malware scanners commonly fetch links in emails with GET, which would
 * otherwise silently consume the one-time confirmation token. We only act on
 * an explicit POST from the interstitial page's "Confirm" button.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const target = new URL('/newsletter/confirm', request.url);
  if (token) {
    target.searchParams.set('token', token);
  }
  return NextResponse.redirect(target);
}

/**
 * POST handler — actually confirms the subscription. Called by the
 * interstitial page after the user clicks "Confirm".
 */
export async function POST(request: Request) {
  try {
    let token: string | null = null;

    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        const body = (await request.json()) as { token?: unknown };
        if (typeof body?.token === 'string') {
          token = body.token;
        }
      } catch {
        // Fall through: invalid JSON is treated as missing token
      }
    } else {
      // Fall back to URL search params for <form method="POST"> submissions
      const { searchParams } = new URL(request.url);
      token = searchParams.get('token');

      if (!token) {
        try {
          const form = await request.formData();
          const value = form.get('token');
          if (typeof value === 'string' && value.length > 0) {
            token = value;
          }
        } catch {
          // ignore — falls through to the missing-token response below
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        { ok: false, reason: 'missing-token' },
        { status: 400 },
      );
    }

    const success = await confirmSubscription(token);

    if (!success) {
      return NextResponse.json(
        { ok: false, reason: 'invalid-token' },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/confirm] server error:', error);
    return NextResponse.json(
      { ok: false, reason: 'server-error' },
      { status: 500 },
    );
  }
}
