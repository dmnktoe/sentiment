'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { Paragraph, Title } from '@/components/ui/typography';

type Tone = 'default' | 'danger';

export interface NewsletterConfirmationContent {
  /** Final URL segment the POST action targets, e.g. `/api/newsletter/confirm` */
  endpoint: string;
  /** Where to redirect once the POST succeeds */
  successRedirect: string;
  /** Copy shown above the action button */
  heading: string;
  /** Highlighted word inside the heading */
  headingHighlight: string;
  /** Intro paragraph */
  body: string;
  /** Label on the primary action button */
  actionLabel: string;
  /** Label while the request is in flight */
  actionLoadingLabel: string;
  /** Optional explanatory hint under the button */
  hint?: string;
  /** Visual tone of the action */
  tone?: Tone;
  /** Optional secondary links shown below the action */
  secondary?: {
    label: string;
    href: string;
  }[];
}

function Frame({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <div className='mx-auto max-w-2xl text-center'>{children}</div>
      </Container>
    </section>
  );
}

function LoadingFallback(): React.ReactElement {
  return (
    <Frame>
      <Title size='two'>Loading...</Title>
    </Frame>
  );
}

function Interstitial({
  content,
}: {
  content: NewsletterConfirmationContent;
}): React.ReactElement {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isDanger = content.tone === 'danger';

  if (!token) {
    if (typeof window !== 'undefined') {
      window.location.replace('/newsletter/error?reason=missing-token');
    }
    return <LoadingFallback />;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(content.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        let reason = 'invalid-token';
        try {
          const body = (await response.json()) as { reason?: string };
          if (typeof body?.reason === 'string') {
            reason = body.reason;
          }
        } catch {
          // ignore — use default reason
        }
        window.location.assign(
          `/newsletter/error?reason=${encodeURIComponent(reason)}`,
        );
        return;
      }

      window.location.assign(content.successRedirect);
    } catch {
      setStatus('error');
      setErrorMessage(
        'A network error occurred. Please check your connection and try again.',
      );
    }
  };

  return (
    <Frame>
      <Title size='two' className='mb-6'>
        {content.heading.split(content.headingHighlight)[0]}
        <span className='text-primary'>{content.headingHighlight}</span>
        {content.heading.split(content.headingHighlight)[1]}
      </Title>
      <Paragraph className='mb-8'>{content.body}</Paragraph>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-4'
      >
        <Button
          type='submit'
          disabled={status === 'loading'}
          className={
            isDanger
              ? 'bg-transparent !text-text hover:!bg-red-600 hover:!text-white'
              : undefined
          }
        >
          {status === 'loading'
            ? content.actionLoadingLabel
            : content.actionLabel}
        </Button>

        {content.hint && (
          <Paragraph className='text-sm text-tertiary' margin={false} size='sm'>
            {content.hint}
          </Paragraph>
        )}

        {status === 'error' && errorMessage && (
          <div role='alert' aria-live='assertive'>
            <Paragraph
              className='text-sm text-red-600'
              margin={false}
              size='sm'
            >
              {errorMessage}
            </Paragraph>
          </div>
        )}
      </form>

      {content.secondary && content.secondary.length > 0 && (
        <div className='mt-6 flex flex-col items-center gap-2 text-sm'>
          {content.secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              variant='underline'
              className='text-tertiary hover:text-text'
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </Frame>
  );
}

export function NewsletterConfirmation({
  content,
}: {
  content: NewsletterConfirmationContent;
}): React.ReactElement {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Interstitial content={content} />
    </Suspense>
  );
}
