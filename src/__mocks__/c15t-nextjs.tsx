/**
 * Jest mock for `@c15t/nextjs`.
 *
 * The real package pulls in Next.js server-only modules (via
 * `next/cache`) which are not available inside `jest-environment-jsdom`.
 * This mock provides the minimal surface used by our own components.
 */
import type { ReactNode } from 'react';

export const ConsentManagerProvider = ({
  children,
}: {
  children: ReactNode;
}) => <>{children}</>;

export const ConsentBanner = () => null;
export const ConsentDialog = () => null;
export const ConsentWidget = () => null;

export const useConsentManager = () => ({
  setActiveUI: () => undefined,
  saveConsents: () => undefined,
  resetConsents: () => undefined,
  gdprConsents: {},
});

export type Theme = Record<string, unknown>;
