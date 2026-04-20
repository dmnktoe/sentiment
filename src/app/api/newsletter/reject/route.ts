import { NextResponse } from 'next/server';

import { cmsApiToken, cmsApiUrl } from '@/constant/env';

/**
 * Reject (delete) an unconfirmed subscriber by token.
 *
 * Used by the "That wasn't me" link in the confirmation email so a recipient
 * who never signed up can purge their record immediately rather than waiting
 * for the token to expire. Only unconfirmed subscribers are deleted — already
 * confirmed subscribers must use the unsubscribe flow.
 */
export async function rejectSubscription(token: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `${cmsApiUrl}/api/subscribers/by-token?token=${encodeURIComponent(token)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${cmsApiToken}`,
        },
        signal: controller.signal,
      },
    );

    return response.ok;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/reject] Strapi call failed:', error);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readToken(request: Request): Promise<string | null> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      const body = (await request.json()) as { token?: unknown };
      if (typeof body?.token === 'string' && body.token.length > 0) {
        return body.token;
      }
    } catch {
      // fall through
    }
    return null;
  }

  const { searchParams } = new URL(request.url);
  const fromQuery = searchParams.get('token');
  if (fromQuery) return fromQuery;

  try {
    const form = await request.formData();
    const value = form.get('token');
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * GET handler — redirects to the interstitial page so that email-link
 * prefetchers cannot silently consume the token.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const target = new URL('/newsletter/reject', request.url);
  if (token) {
    target.searchParams.set('token', token);
  }
  return NextResponse.redirect(target);
}

/**
 * POST handler — actually deletes the unconfirmed subscriber.
 */
export async function POST(request: Request) {
  try {
    const token = await readToken(request);

    if (!token) {
      return NextResponse.json(
        { ok: false, reason: 'missing-token' },
        { status: 400 },
      );
    }

    const success = await rejectSubscription(token);

    if (!success) {
      // Either already confirmed or unknown token — treat the same to avoid
      // leaking confirmation status to a non-subscriber.
      return NextResponse.json(
        { ok: false, reason: 'invalid-token' },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/reject] server error:', error);
    return NextResponse.json(
      { ok: false, reason: 'server-error' },
      { status: 500 },
    );
  }
}
