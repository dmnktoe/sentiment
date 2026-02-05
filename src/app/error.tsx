'use client';

import { useEffect } from 'react';

import { MaintenanceScreen } from '@/components/templates/MaintenanceScreen';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  // Check if error is related to Strapi/CMS
  const isCMSError =
    error.message.includes('Failed to fetch') ||
    error.message.includes('server is running') ||
    error.message.includes('Bad Gateway') ||
    error.message.includes('cms.project-sentiment.org');

  if (isCMSError) {
    return (
      <MaintenanceScreen
        title='Service Temporarily Unavailable'
        message='We are experiencing technical difficulties with our content delivery system. Our team is working to restore service as quickly as possible.'
        showRetry={true}
      />
    );
  }

  // Generic error fallback
  return (
    <MaintenanceScreen
      title='Something Went Wrong'
      message='An unexpected error occurred. Please try again or contact support if the problem persists.'
      showRetry={true}
    />
  );
}
