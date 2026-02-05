import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/ui/icons/Logo';

interface MaintenanceScreenProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  errorDetails?: string;
}

export function MaintenanceScreen({
  title = 'Under Maintenance',
  message = 'Our system is currently unavailable. Please try again later.',
  showRetry = true,
  onRetry,
  errorDetails,
}: MaintenanceScreenProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Container>
        <div className='mx-auto max-w-2xl px-4 text-center'>
          <div className='mb-8 flex justify-center'>
            <Logo variant='logoWithText' />
          </div>

          <div className='mb-6'>
            <h1 className='mb-4 text-4xl font-bold text-text md:text-5xl'>
              {title}
            </h1>
            <p className='text-lg text-tertiary'>{message}</p>
          </div>

          {showRetry && (
            <div className='mt-8'>
              <button
                onClick={onRetry || (() => window.location.reload())}
                className='rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90'
              >
                Retry
              </button>
            </div>
          )}

          {errorDetails && (
            <div className='mt-8 rounded-lg bg-red-50 p-4 text-left'>
              <h3 className='mb-2 text-sm font-semibold text-red-800'>
                Error Details:
              </h3>
              <pre className='overflow-x-auto text-xs text-red-600'>
                {errorDetails}
              </pre>
            </div>
          )}

          <div className='mt-12 text-sm text-tertiary'>
            <p>If the problem persists, please contact our support team.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
