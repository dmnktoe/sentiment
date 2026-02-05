'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';

  const errorMessages: Record<string, string> = {
    'missing-token': 'Der Bestätigungslink ist ungültig oder unvollständig.',
    'invalid-token':
      'Der Token ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an.',
    'server-error':
      'Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    unknown: 'Ein unbekannter Fehler ist aufgetreten.',
  };

  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>
          <Title size='two' className='mb-6'>
            <span className='text-primary'>Fehler</span> aufgetreten
          </Title>
          <Paragraph className='mb-8'>
            {errorMessages[reason] || errorMessages.unknown}
          </Paragraph>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Button href='/'>Zurück zur Startseite</Button>
            <Button href='/#newsletter'>Erneut versuchen</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function NewsletterErrorPage() {
  return (
    <Suspense
      fallback={
        <section className='py-24 sm:py-36'>
          <Container>
            <div className='mx-auto max-w-2xl text-center'>
              <Title size='two'>Laden...</Title>
            </div>
          </Container>
        </section>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
