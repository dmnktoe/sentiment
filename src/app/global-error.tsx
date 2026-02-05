'use client';

import { MaintenanceScreen } from '@/components/templates/MaintenanceScreen';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <MaintenanceScreen
          title='Critical System Error'
          message='We encountered a critical error. Please refresh the page or try again later.'
          showRetry={true}
        />
      </body>
    </html>
  );
}
