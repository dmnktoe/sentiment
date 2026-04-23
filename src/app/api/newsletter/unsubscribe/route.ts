import { NextResponse } from 'next/server';

import {
  findSubscriberByUuid,
  unsubscribeSubscriberFromLists,
} from '@/lib/listmonk';

import { listmonkListId } from '@/constant/env';

/**
 * Unsubscribe user endpoint
 * GDPR Compliant: Allows users to easily opt-out at any time
 */
export async function unsubscribeUser(
  token: string,
): Promise<{ success: boolean; email?: string }> {
  try {
    const listId = Number(listmonkListId);
    if (!Number.isInteger(listId) || listId <= 0) {
      return { success: false };
    }

    const subscriber = await findSubscriberByUuid(token);
    if (!subscriber) {
      return { success: false };
    }

    await unsubscribeSubscriberFromLists({
      subscriberIds: [subscriber.id],
      targetListIds: [listId],
    });

    // Email delivery is handled by listmonk (optional campaigns / templates).
    return { success: true, email: subscriber.email };
  } catch {
    return { success: false };
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
