// jest-environment-jsdom can't resolve next/cache which @c15t/nextjs pulls in
import type { ReactNode } from 'react';

export const ConsentManagerProvider = ({
  children,
}: {
  children: ReactNode;
}) => <>{children}</>;

export const useConsentManager = () => ({
  activeUI: 'none' as const,
  setActiveUI: () => undefined,
  saveConsents: () => Promise.resolve(),
  resetConsents: () => undefined,
  setConsent: () => undefined,
  consents: {
    necessary: true,
    measurement: false,
    functionality: false,
    experience: false,
  },
  selectedConsents: {
    necessary: true,
    measurement: false,
    functionality: false,
    experience: false,
  },
  consentInfo: null,
  manager: null,
});
