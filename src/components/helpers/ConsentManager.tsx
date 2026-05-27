'use client';

import { ConsentManagerProvider, useConsentManager } from '@c15t/nextjs';
import type { ComponentProps, ReactNode } from 'react';

import { Container } from '@/components/layout/Container';
import { ConsentCategoryWidget } from '@/components/templates/ConsentCategoryWidget';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/icons/Logo';
import { Link } from '@/components/ui/Link';

import { umamiScriptUrl, umamiWebsiteId } from '@/constant/consent';

type ConsentManagerOptions = ComponentProps<
  typeof ConsentManagerProvider
>['options'];

function buildOptions(
  scripts: ConsentManagerOptions['scripts'],
): ConsentManagerOptions {
  return {
    consentCategories: ['necessary', 'measurement'],
    mode: 'offline',
    scripts,
  } as ConsentManagerOptions;
}

function CustomBanner() {
  const { activeUI, saveConsents, setActiveUI } = useConsentManager();

  if (activeUI !== 'banner') return null;

  return (
    <div className='fixed inset-x-0 bottom-0 z-[999999] bg-bg/80 p-3 backdrop-blur-md sm:p-6'>
      <Container>
        <div className='rounded-lg border border-grid bg-bg p-5 shadow-xl sm:p-8'>
          <div className='flex items-start gap-3 sm:items-center'>
            <Logo
              variant='logoOnly'
              className='mt-0.5 h-6 w-6 shrink-0 text-primary sm:mt-0 sm:h-7 sm:w-7'
            />
            <h2 className='font-secondary text-lg leading-tight tracking-tighter text-text sm:text-2xl'>
              We value your <span className='italic text-primary'>privacy</span>
            </h2>
          </div>
          <p className='mt-3 text-sm leading-relaxed text-tertiary'>
            We use cookies to run essential parts of this site and — only with
            your permission — to measure how our research content is received.
            You can change your choice any time via{' '}
            <Link href='/cookies' variant='underline'>
              cookie settings
            </Link>{' '}
            or on the{' '}
            <Link href='/privacy' variant='underline'>
              privacy page
            </Link>
            .
          </p>
          <div className='mt-5 flex flex-col gap-2 border-t border-grid pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3'>
            <Button
              onClick={() => saveConsents('all')}
              className='w-full sm:w-auto'
            >
              accept all
            </Button>
            <Button
              onClick={() => saveConsents('necessary')}
              className='w-full bg-bg text-text hover:bg-grid hover:text-text sm:w-auto'
            >
              reject all
            </Button>
            <Button
              onClick={() => setActiveUI('dialog')}
              className='w-full border-transparent bg-transparent text-tertiary hover:bg-transparent hover:text-primary sm:w-auto'
            >
              customize
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

function CustomDialog() {
  const { activeUI, saveConsents, setActiveUI } = useConsentManager();

  if (activeUI !== 'dialog') return null;

  return (
    <div className='fixed inset-0 z-[999999] flex items-end justify-center bg-text/40 sm:items-center sm:p-4'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='cookie-settings-title'
        aria-describedby='cookie-settings-desc'
        className='relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-lg border border-grid bg-bg shadow-xl sm:max-w-lg sm:rounded-lg'
      >
        <div className='flex flex-col gap-2 px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4'>
          <h2
            id='cookie-settings-title'
            className='font-secondary text-lg tracking-tighter text-text sm:text-xl'
          >
            Cookie <span className='italic text-primary'>settings</span>
          </h2>
          <p
            id='cookie-settings-desc'
            className='text-sm leading-relaxed text-tertiary'
          >
            Choose which types of cookies you allow. Necessary cookies are
            required for the site to work and are always active.
          </p>
        </div>
        <div className='flex-1 overflow-y-auto px-5 pb-3 sm:px-6 sm:pb-4'>
          <ConsentCategoryWidget />
        </div>
        <div className='flex flex-col gap-2 border-t border-grid px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:px-6'>
          <Button
            onClick={() => saveConsents('necessary')}
            className='w-full bg-bg text-text hover:bg-grid hover:text-text sm:w-auto'
          >
            reject all
          </Button>
          <Button
            onClick={() => saveConsents('custom')}
            className='w-full sm:w-auto'
          >
            save preferences
          </Button>
          <Button
            onClick={() => saveConsents('all')}
            className='w-full sm:w-auto'
          >
            accept all
          </Button>
        </div>
        <button
          type='button'
          onClick={() => setActiveUI('banner')}
          className='absolute right-3 top-3 p-1.5 text-lg leading-none text-tertiary hover:text-text sm:right-4 sm:top-4'
          aria-label='Close'
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ConsentManager({ children }: { children: ReactNode }) {
  const scripts: NonNullable<ConsentManagerOptions['scripts']> = [];

  if (umamiWebsiteId) {
    scripts.push({
      id: 'umami',
      src: umamiScriptUrl,
      category: 'measurement',
      defer: true,
      attributes: { 'data-website-id': umamiWebsiteId },
    });
  }

  return (
    <ConsentManagerProvider
      options={buildOptions(scripts.length > 0 ? scripts : undefined)}
    >
      <CustomBanner />
      <CustomDialog />
      {children}
    </ConsentManagerProvider>
  );
}
