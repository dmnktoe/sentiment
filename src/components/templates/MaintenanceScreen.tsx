import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/ui/icons/Logo';

interface MaintenanceScreenProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export function MaintenanceScreen({
  title = 'Under Maintenance',
  message = 'Our system is currently unavailable. Please try again later.',
  showRetry = true,
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
                onClick={() => window.location.reload()}
                className='rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90'
              >
                Retry
              </button>
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
