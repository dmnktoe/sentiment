'use client';

import { ConsentWidget, useConsentManager } from '@c15t/nextjs';

import clsxm from '@/lib/clsxm';

import { Button } from '@/components/ui/Button';
import { Paragraph, Title } from '@/components/ui/typography';

/**
 * Inline consent control center — mirrors the visual language of the
 * newsletter CTA (`NewsletterCTA`) with a two-column rounded card.
 *
 * The left column explains the control, the right column embeds the c15t
 * `ConsentWidget` so users can toggle categories right inside the privacy
 * policy page, without opening any modal.
 */
export function CookieControlCenter({ className }: { className?: string }) {
  const { saveConsents, resetConsents } = useConsentManager();

  return (
    <div
      id='cookie-settings'
      className={clsxm('scroll-mt-24 px-2 sm:px-4', className)}
    >
      <div className='group grid grid-cols-1 gap-8 rounded-lg bg-primary/5 p-8 hover:bg-primary/20 lg:grid-cols-2 lg:gap-12 lg:p-12'>
        {/* Text Section - Left */}
        <div className='flex flex-col justify-center'>
          <Title
            renderAs='h2'
            size='three'
            className='mb-4 group-hover:underline group-hover:decoration-primary/50'
          >
            Cookie <br />
            Control Center
          </Title>
          <Paragraph className='mb-6 text-base' color='light'>
            Fine-tune which categories of cookies we may use while you browse
            our research content. Changes are applied immediately and stored in
            a consent record on your device.
          </Paragraph>
          <div className='space-y-2 text-sm text-tertiary'>
            <p className='flex items-center gap-2'>
              <span className='text-primary'>✓</span>
              Toggle categories individually
            </p>
            <p className='flex items-center gap-2'>
              <span className='text-primary'>✓</span>
              Scripts load only after your consent
            </p>
            <p className='flex items-center gap-2'>
              <span className='text-primary'>✓</span>
              Revoke or reset any time
            </p>
          </div>
          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Button type='button' onClick={() => saveConsents('all')}>
              Accept all
            </Button>
            <button
              type='button'
              onClick={() => saveConsents('necessary')}
              className='rounded-full border border-solid border-text/30 px-4 py-1 text-sm text-text transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg dark:border-white/30'
            >
              Reject non-essential
            </button>
            <button
              type='button'
              onClick={() => resetConsents()}
              className='text-sm text-tertiary underline underline-offset-4 transition-colors hover:text-primary'
            >
              Reset my choice
            </button>
          </div>
        </div>

        {/* Widget Section - Right */}
        <div className='flex flex-col justify-center'>
          <div className='rounded-lg border border-solid border-grid bg-bg p-4 sm:p-6'>
            <ConsentWidget
              hideBranding
              legalLinks={['privacyPolicy', 'cookiePolicy']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
