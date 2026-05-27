'use client';

import { useConsentManager } from '@c15t/nextjs';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import clsxm from '@/lib/clsxm';

import { Link } from '@/components/ui/Link';

type Vendor = {
  name: string;
  purpose: string;
  privacyUrl: string;
};

type Category = {
  id: 'necessary' | 'measurement';
  label: string;
  description: string;
  required?: boolean;
  vendors: Vendor[];
};

const categories: Category[] = [
  {
    id: 'necessary',
    label: 'Strictly Necessary',
    description:
      'Essential for the website to function. These cookies enable core features like page navigation, security (ALTCHA bot protection), and storing your consent preference. They cannot be disabled.',
    required: true,
    vendors: [
      {
        name: 'c15t Consent Manager',
        purpose: 'Stores your cookie consent preferences locally',
        privacyUrl: 'https://c15t.com/privacy',
      },
      {
        name: 'ALTCHA',
        purpose: 'Bot protection for forms (proof-of-work challenge)',
        privacyUrl: 'https://altcha.org/privacy-policy',
      },
      {
        name: 'Vercel',
        purpose: 'Hosting and edge network delivery',
        privacyUrl: 'https://vercel.com/legal/privacy-policy',
      },
    ],
  },
  {
    id: 'measurement',
    label: 'Analytics',
    description:
      'Help us understand how visitors interact with the site so we can improve our research content. All analytics data is processed on EU servers (Hetzner).',
    vendors: [
      {
        name: 'Umami Analytics',
        purpose:
          'Privacy-friendly, cookieless page view and event tracking (self-hosted, EU)',
        privacyUrl: 'https://umami.is/privacy',
      },
    ],
  },
];

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type='button'
      role='switch'
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={clsxm(
        'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
        'focus:outline-hidden focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-bg',
        checked ? 'bg-primary' : 'bg-grid',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      )}
    >
      <span
        className={clsxm(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-bg shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}

function CategoryItem({ category }: { category: Category }) {
  const { selectedConsents, setConsent } = useConsentManager();
  const [open, setOpen] = useState(false);
  const panelId = `consent-panel-${category.id}`;
  const checked = category.required || selectedConsents[category.id];

  return (
    <div className='rounded-lg border border-grid bg-bg'>
      <div className='flex items-center justify-between gap-4 px-4 py-3'>
        <button
          type='button'
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className='flex flex-1 items-center gap-2 text-left'
        >
          <ChevronDown
            className={clsxm(
              'h-4 w-4 shrink-0 text-tertiary transition-transform',
              open && 'rotate-180',
            )}
          />
          <span className='text-sm font-medium text-text'>
            {category.label}
          </span>
          {category.required && (
            <span className='rounded-full bg-grid px-2 py-0.5 text-xs text-tertiary'>
              Always on
            </span>
          )}
        </button>
        <Toggle
          checked={!!checked}
          disabled={category.required}
          label={`${category.label} cookies`}
          onChange={(v) => setConsent(category.id, v)}
        />
      </div>
      {open && (
        <div id={panelId} className='border-t border-grid px-4 py-3'>
          <p className='text-sm leading-relaxed text-tertiary'>
            {category.description}
          </p>
          {category.vendors.length > 0 && (
            <div className='mt-3 space-y-2'>
              <p className='text-xs font-semibold uppercase tracking-wider text-text'>
                Services
              </p>
              {category.vendors.map((vendor) => (
                <div
                  key={vendor.name}
                  className='flex items-start justify-between gap-4 rounded-md bg-grid/50 px-3 py-2'
                >
                  <div>
                    <p className='text-sm font-medium text-text'>
                      {vendor.name}
                    </p>
                    <p className='text-xs text-tertiary'>{vendor.purpose}</p>
                  </div>
                  <Link
                    href={vendor.privacyUrl}
                    external
                    variant='underline'
                    className='shrink-0 text-xs text-tertiary'
                  >
                    Privacy
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ConsentCategoryWidget() {
  return (
    <div className='space-y-2'>
      {categories.map((cat) => (
        <CategoryItem key={cat.id} category={cat} />
      ))}
    </div>
  );
}
