'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Logo } from '@/components/ui/icons/Logo';
import NavLink from '@/components/ui/NavLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { href: '/about', text: 'About' },
  { href: '/team', text: 'Team' },
  { href: '/articles', text: 'Articles' },
  { href: '/exhibition', text: 'Exhibition' },
];

function Navigation() {
  return (
    <nav aria-label='Primary navigation'>
      <ul className='flex flex-row gap-1'>
        {navLinks.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href}>{link.text}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const mobileNavId = React.useId();
  const mobileNavRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!mobileNavOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileNavOpen(false);
    }

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (mobileNavRef.current?.contains(target)) return;
      setMobileNavOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [mobileNavOpen]);

  return (
    <header className='pointer-events-none fixed z-30 flex w-full justify-center'>
      <div className='pointer-events-auto relative mt-8 flex items-center justify-between gap-3 rounded-full border-[1px] border-solid border-black bg-white/85 px-2 py-2 pl-4 shadow-xs backdrop-blur-md dark:border-white/20 dark:bg-neutral-950/85 sm:gap-16'>
        <Link
          href='/'
          aria-label='Go to homepage'
          className='text-black ease-in-out hover:text-primary dark:text-white dark:hover:text-primary'
        >
          <Logo className='w-24 sm:w-48' variant='textOnly' />
        </Link>

        <div className='flex items-center gap-1'>
          <div className='hidden sm:block'>
            <Navigation />
          </div>

          <button
            type='button'
            className='inline-flex h-8 w-8 items-center justify-center rounded-2xl px-2 py-1 text-sm transition-colors hover:bg-neutral-200/75 hover:text-black focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:hover:bg-neutral-700/75 dark:hover:text-white sm:hidden'
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            aria-controls={mobileNavId}
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? (
              <X className='h-4 w-4' aria-hidden='true' />
            ) : (
              <Menu className='h-4 w-4' aria-hidden='true' />
            )}
          </button>

          <ThemeToggle />
        </div>

        <div
          id={mobileNavId}
          ref={mobileNavRef}
          className='absolute left-0 top-full mt-2 w-full px-2 sm:hidden'
          hidden={!mobileNavOpen}
        >
          <nav
            aria-label='Mobile navigation'
            className='rounded-3xl border border-black bg-white/95 p-2 shadow-xs backdrop-blur-md dark:border-white/20 dark:bg-neutral-950/95'
          >
            <ul className='flex flex-col gap-1'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
