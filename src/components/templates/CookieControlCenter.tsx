'use client';

import { useConsentManager } from '@c15t/nextjs';

import clsxm from '@/lib/clsxm';

import { ConsentCategoryWidget } from '@/components/templates/ConsentCategoryWidget';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/icons/Logo';
import { Paragraph, Title } from '@/components/ui/typography';

export function CookieControlCenter({ className }: { className?: string }) {
  const { saveConsents, resetConsents } = useConsentManager();

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
          Toggle which cookie categories we may use. Changes apply immediately.
        </Paragraph>

        <ConsentCategoryWidget />

        <div className='mt-6 flex flex-wrap items-center gap-3 border-t border-grid pt-6'>
          <Button type='button' onClick={() => saveConsents('all')}>
            accept all
          </Button>
          <Button
            type='button'
            onClick={() => saveConsents('necessary')}
            className='bg-bg text-text hover:bg-grid hover:text-text'
          >
            reject non-essential
          </Button>
          <Button
            type='button'
            onClick={() => saveConsents('custom')}
            className='bg-bg text-text hover:bg-grid hover:text-text'
          >
            save preferences
          </Button>
          <button
            type='button'
            onClick={() => resetConsents()}
            className='text-sm text-tertiary underline underline-offset-4 hover:text-primary'
          >
            Reset my choice
          </button>
        </div>
      </div>
    </div>
  );
}
