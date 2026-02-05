'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { NewsletterSubscribeInput } from '@/lib/newsletter-schema';
import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';

// TypeScript Typen für ALTCHA
interface AltchaStateChangeEvent extends Event {
  detail: {
    payload?: string;
    state?: 'unverified' | 'verifying' | 'verified' | 'error';
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'altcha-widget': HTMLElement & {
      reset: () => void;
    };
  }
}

export function NewsletterForm() {
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
    // Warte auf ALTCHA Widget
    const checkWidget = setInterval(() => {
      const widget = document.querySelector('altcha-widget');
      if (widget) {
        setWidgetReady(true);
        clearInterval(checkWidget);
      }
    }, 100);

    // Timeout nach 5 Sekunden
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

    // Event Listener registrieren
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
        throw new Error(result.error || 'Ein Fehler ist aufgetreten');
      }

      setStatus('success');
      setMessage(
        'Vielen Dank! Bitte überprüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Anmeldung.',
      );
      reset();

      // Widget zurücksetzen
      const widget = document.querySelector(
        'altcha-widget',
      ) as HTMLElementTagNameMap['altcha-widget'];
      if (widget?.reset) {
        widget.reset();
      }
    } catch (error) {
      console.error('❌ Submit Error:', error);
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* E-Mail Feld */}
      <div>
        <label htmlFor='email' className='mb-2 block text-sm font-medium'>
          E-Mail-Adresse
        </label>
        <input
          {...register('email')}
          type='email'
          id='email'
          disabled={status === 'loading'}
          className='w-full rounded-lg border border-black bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50'
          placeholder='ihre@email.de'
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
        )}
      </div>

      {/* ALTCHA Widget */}
      <div className='min-h-[80px]'>
        <altcha-widget
          id='altcha-widget'
          challengeurl='/api/newsletter/challenge'
          hidefooter='false'
          hidelogo='false'
        />

        {/* Verstecktes Feld, das von react-hook-form überwacht wird */}
        <input type='hidden' {...register('altcha')} />

        {errors.altcha && (
          <p className='mt-1 text-sm text-red-600'>{errors.altcha.message}</p>
        )}

        {!widgetReady && (
          <p className='mt-2 text-xs text-gray-500'>
            Bot-Schutz wird geladen...
          </p>
        )}
      </div>

      {/* Datenschutz Checkbox */}
      <div className='flex items-start gap-2'>
        <input
          {...register('privacy')}
          type='checkbox'
          id='privacy'
          disabled={status === 'loading'}
          className='mt-1 h-4 w-4 rounded border-black text-black focus:ring-2 focus:ring-black disabled:opacity-50'
        />
        <label htmlFor='privacy' className='text-sm'>
          Ich habe die{' '}
          <Link href='/privacy' variant='underline' className='font-medium'>
            Datenschutzerklärung
          </Link>{' '}
          gelesen und akzeptiere diese.
        </label>
      </div>
      {errors.privacy && (
        <p className='text-sm text-red-600'>{errors.privacy.message}</p>
      )}

      {/* Submit Button */}
      <Button type='submit' disabled={status === 'loading'} className='w-full'>
        {status === 'loading' ? 'Wird gesendet...' : 'Jetzt anmelden'}
      </Button>

      {/* Status Nachrichten */}
      {message && (
        <div
          className={`rounded-lg p-4 transition-all ${
            status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
