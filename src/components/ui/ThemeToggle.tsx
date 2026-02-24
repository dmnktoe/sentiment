'use client';

import { useTheme } from 'next-themes';

import { useHasMounted } from '@/lib/useHasMounted';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  // Render placeholder to avoid layout shift before hydration
  if (!mounted) {
    return (
      <span className='rounded-2xl px-2 py-1 text-sm sm:text-lg'>
        <span className='invisible'>○</span>
      </span>
    );
  }

  return (
    <button
      type='button'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      className='rounded-2xl px-2 py-1 text-sm hover:bg-neutral-200/75 hover:text-black dark:hover:bg-neutral-700/75 dark:hover:text-white sm:text-lg'
    >
      {resolvedTheme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
