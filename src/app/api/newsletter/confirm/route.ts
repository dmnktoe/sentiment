import { NextResponse } from 'next/server';

import { listmonkBaseUrl } from '@/constant/env';

/**
 * Confirm subscription endpoint helper
 * listmonk handles double opt-in confirmation on its public opt-in page.
 */
export function getListmonkOptInUrl(token: string): string | null {
  const base = listmonkBaseUrl?.replace(/\/+$/, '');
  if (!base) return null;
  return `${base}/subscription/optin/${encodeURIComponent(token)}`;
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

    const optInUrl = getListmonkOptInUrl(token);
    if (!optInUrl) {
      return NextResponse.redirect(
        new URL('/newsletter/error?reason=server-error', request.url),
      );
    }

    // Redirect user to listmonk's opt-in confirmation page.
    return NextResponse.redirect(optInUrl);
  } catch {
    return NextResponse.redirect(
      new URL('/newsletter/error?reason=server-error', request.url),
    );
  }
}
