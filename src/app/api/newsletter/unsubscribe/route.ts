import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

import { cmsApiToken, cmsApiUrl } from '@/constant/env';
import GoodbyeEmail from '@/emails/goodbye';

/**
 * Unsubscribe a user by token.
 * GDPR Compliant: Allows users to easily opt-out at any time.
 */
export async function unsubscribeUser(
  token: string,
): Promise<{ success: boolean; email?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const encodedToken = encodeURIComponent(token);
    const response = await fetch(
      `${cmsApiUrl}/api/subscribers/unsubscribe?token=${encodedToken}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cmsApiToken}`,
        },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    return { success: true, email: data.email };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/unsubscribe] Strapi call failed:', error);
    return { success: false };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Send goodbye confirmation email.
 * Best-effort: failures are logged but do not propagate — unsubscribe still succeeded.
 */
export async function sendGoodbyeEmail(email: string): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const emailHtml = await render(GoodbyeEmail());

    await fetch(`${cmsApiUrl}/api/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cmsApiToken}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        to: email,
        subject: 'Newsletter unsubscription confirmed',
        html: emailHtml,
      }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/unsubscribe] goodbye email failed:', error);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Read a token from a JSON body, URL search params, or form data.
 */
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
 * GET handler — redirects to the interstitial page. Using GET directly from
 * an email link would let anti-malware scanners and link previewers consume
 * the token silently; only a user-initiated POST actually unsubscribes.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const target = new URL('/newsletter/unsubscribe', request.url);
  if (token) {
    target.searchParams.set('token', token);
  }
  return NextResponse.redirect(target);
}

/**
 * POST handler — actually unsubscribes. Called by the interstitial page.
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

    const result = await unsubscribeUser(token);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, reason: 'invalid-token' },
        { status: 400 },
      );
    }

    if (result.email) {
      // Fire-and-forget — response is not gated on email delivery
      sendGoodbyeEmail(result.email).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(
          '[newsletter/unsubscribe] goodbye email dispatch failed:',
          error,
        );
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[newsletter/unsubscribe] server error:', error);
    return NextResponse.json(
      { ok: false, reason: 'server-error' },
      { status: 500 },
    );
  }
}
