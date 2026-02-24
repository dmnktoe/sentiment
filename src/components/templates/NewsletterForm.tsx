'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { NewsletterSubscribeInput } from '@/lib/newsletter-schema';
import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';
import { useHasMounted } from '@/lib/useHasMounted';

import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { Paragraph } from '@/components/ui/typography';

interface AltchaStateChangeEvent extends Event {
  detail: {
    payload?: string;
    state?: 'unverified' | 'verifying' | 'verified' | 'error';
  };
}

const altchaStyleLight: AltchaWidgetCSSProperties = {
  '--altcha-border-width': '1px',
  '--altcha-border-radius': '8px',
  '--altcha-color-base': '#ffffff',
  '--altcha-color-border': '#000000',
  '--altcha-color-text': '#000000',
  '--altcha-color-border-focus': '#FF5C24',
  '--altcha-color-error-text': '#f23939',
  '--altcha-color-footer-bg': '#f2f2f2',
  '--altcha-max-width': '100%',
};

const altchaStyleDark: AltchaWidgetCSSProperties = {
  '--altcha-border-width': '1px',
  '--altcha-border-radius': '8px',
  '--altcha-color-base': '#171717',
  '--altcha-color-border': 'rgba(255,255,255,0.2)',
  '--altcha-color-text': '#f5f5f5',
  '--altcha-color-border-focus': '#FF5C24',
  '--altcha-color-error-text': '#f87171',
  '--altcha-color-footer-bg': '#262626',
  '--altcha-max-width': '100%',
};

export function NewsletterForm() {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();

  const altchaStyle =
    mounted && resolvedTheme === 'dark' ? altchaStyleDark : altchaStyleLight;

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string>('');
  const [widgetReady, setWidgetReady] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NewsletterSubscribeInput>({
    resolver: zodResolver(newsletterSubscribeSchema),
    defaultValues: {
      email: '',
      altcha: '',
      privacy: false,
    },
  });

  useEffect(() => {
    const checkWidget = setInterval(() => {
      const widget = document.querySelector('altcha-widget');
      if (widget) {
        setWidgetReady(true);
        clearInterval(checkWidget);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkWidget);
    }, 5000);

    return () => {
      clearInterval(checkWidget);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!widgetReady) return;

    const widget = document.querySelector('altcha-widget');
    if (!widget) return;

    const handleStateChange = (ev: Event) => {
      const event = ev as AltchaStateChangeEvent;

      if (event.detail?.payload) {
        setValue('altcha', event.detail.payload, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    };

    widget.addEventListener('statechange', handleStateChange);
    widget.addEventListener('verified', handleStateChange);

    return () => {
      widget.removeEventListener('statechange', handleStateChange);
      widget.removeEventListener('verified', handleStateChange);
    };
  }, [widgetReady, setValue]);

  const onSubmit = async (data: NewsletterSubscribeInput) => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred');
      }

      setStatus('success');
      setMessage(
        'Thank you! Please check your email inbox and confirm your subscription.',
      );
      reset();

      // Reset widget
      const widget = document.querySelector('altcha-widget') as HTMLElement & {
        reset?: () => void;
      };
      if (widget?.reset) {
        widget.reset();
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again later.',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {/* Email Field */}
      <div className='group'>
        <label
          htmlFor='email'
          className='mb-2 block text-sm font-medium text-text/70 group-hover:text-text transition-colors'
        >
          Email Address
        </label>
        <input
          {...register('email')}
          type='email'
          id='email'
          disabled={status === 'loading'}
          className='w-full rounded-lg border border-black bg-white px-4 py-3 text-base text-text transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-neutral-900 placeholder:text-tertiary'
          placeholder='your@email.com'
        />
        {errors.email && (
          <Paragraph
            className='mt-1 text-sm text-red-600'
            margin={false}
            size='sm'
          >
            {errors.email.message}
          </Paragraph>
        )}
      </div>

      <div className='min-h-[100px]'>
        <altcha-widget
          id='altcha-widget'
          challengeurl='/api/newsletter/challenge'
          hidefooter={false}
          hidelogo={false}
          strings='{"label":"I am not a robot","verifying":"Verifying...","verified":"Verified","error":"Verification failed. Please try again later."}'
          style={altchaStyle}
        />

        {/* Hidden field monitored by react-hook-form */}
        <input type='hidden' {...register('altcha')} />

        {errors.altcha && (
          <Paragraph
            className='mt-1 text-sm text-red-600'
            margin={false}
            size='sm'
          >
            {errors.altcha.message}
          </Paragraph>
        )}

        {!widgetReady && (
          <Paragraph
            className='mt-2 text-xs text-tertiary'
            margin={false}
            size='sm'
          >
            Bot protection loading...
          </Paragraph>
        )}
      </div>

      {/* Privacy Checkbox */}
      <div className='group flex items-center gap-3 rounded-lg p-3 hover:bg-grid'>
        <input
          {...register('privacy')}
          type='checkbox'
          id='privacy'
          disabled={status === 'loading'}
          className='mt-0.5 h-5 w-5 rounded border-2 border-black text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/30 dark:bg-neutral-900 dark:focus:ring-offset-neutral-950'
        />
        <label
          htmlFor='privacy'
          className='cursor-pointer text-sm leading-tight group-hover:text-text/90'
        >
          I have read the{' '}
          <Link
            href='/privacy'
            variant='underline'
            className='font-medium text-primary hover:text-secondary'
          >
            Privacy Policy
          </Link>{' '}
          and accept it.
        </label>
      </div>
      {errors.privacy && (
        <Paragraph className='text-sm text-red-600' margin={false} size='sm'>
          {errors.privacy.message}
        </Paragraph>
      )}

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={status === 'loading'}
        className='w-full py-3 text-base font-semibold'
      >
        {status === 'loading' ? 'Sending...' : 'Subscribe Now'}
      </Button>

      {/* Status Messages */}
      {message && (
        <div
          className={`animate-in fade-in slide-in-from-top-2 rounded-lg p-4 transition-all duration-300 ${
            status === 'success'
              ? 'border-2 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
              : 'border-2 border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
          }`}
        >
          <Paragraph className='text-sm' margin={false}>
            {message}
          </Paragraph>
        </div>
      )}
    </form>
  );
}
