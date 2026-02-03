'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { NewsletterSubscribeInput } from '@/lib/newsletter-schema';
import { newsletterSubscribeSchema } from '@/lib/newsletter-schema';

import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';

export function NewsletterForm() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterSubscribeInput>({
    resolver: zodResolver(newsletterSubscribeSchema),
  });

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
    } catch (error) {
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

      <div>
        <div
          id='altcha-widget'
          data-altcha-name='altcha'
          data-altcha-challengeurl='/api/newsletter/challenge'
        />
        <input type='hidden' {...register('altcha')} />
        {errors.altcha && (
          <p className='mt-1 text-sm text-red-600'>{errors.altcha.message}</p>
        )}
      </div>

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

      <Button
        type='submit'
        disabled={status === 'loading'}
        loading={status === 'loading'}
      >
        {status === 'loading' ? 'Wird gesendet...' : 'Jetzt anmelden'}
      </Button>

      {message && (
        <div
          className={`rounded-lg p-4 ${
            status === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
