'use client';

import { ConsentDraftProvider } from 'c15t/next';
import { useHeadlessConsentUI } from 'c15t/next/headless';

import clsxm from '@/lib/clsxm';

import { ConsentCategoryWidget } from '@/components/templates/ConsentCategoryWidget';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/icons/Logo';
import { Paragraph, Title } from '@/components/ui/typography';

export function CookieControlCenter({ className }: { className?: string }) {
  // One draft shared by the category switches and the save buttons below.
  return (
    <ConsentDraftProvider>
      <CookieControlCenterContent className={className} />
    </ConsentDraftProvider>
  );
}

function CookieControlCenterContent({ className }: { className?: string }) {
  const { openBanner, saveCustomPreferences } = useHeadlessConsentUI();

  return (
    <div
      id='cookie-settings'
      className={clsxm('scroll-mt-24 px-2 sm:px-4', className)}
    >
      <div className='rounded-lg border border-grid bg-bg p-6 sm:p-8'>
        <div className='mb-6 flex items-center gap-3'>
          <Logo variant='logoOnly' className='h-8 w-8 text-primary' />
          <Title renderAs='h2' size='five' margin={false}>
            Cookie Control Center
          </Title>
        </div>

        <Paragraph color='light' className='mb-6 max-w-2xl'>
          Toggle which cookie categories we may use, then save your preferences.
        </Paragraph>

        <ConsentCategoryWidget />

        <div className='mt-6 flex flex-wrap items-center gap-3 border-t border-grid pt-6'>
          <Button
            type='button'
            onClick={() => void saveCustomPreferences('all')}
          >
            accept all
          </Button>
          <Button
            type='button'
            onClick={() => void saveCustomPreferences('none')}
            className='bg-bg text-text hover:bg-grid hover:text-text'
          >
            reject non-essential
          </Button>
          <Button
            type='button'
            onClick={() => void saveCustomPreferences()}
            className='bg-bg text-text hover:bg-grid hover:text-text'
          >
            save preferences
          </Button>
          {/* v3 can't erase a recorded choice, so reopen the banner and let the
              next decision replace it. Saving 'none' first would trigger
              c15t's revocation reload and lose the reopened banner. */}
          <button
            type='button'
            onClick={openBanner}
            className='text-sm text-tertiary underline underline-offset-4 hover:text-primary'
          >
            Reset my choice
          </button>
        </div>
      </div>
    </div>
  );
}
