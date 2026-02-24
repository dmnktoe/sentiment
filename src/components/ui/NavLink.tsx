'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import clsxm from '@/lib/clsxm';

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsxm(
        'rounded-2xl px-2 py-1 text-sm hover:bg-neutral-200/75 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:hover:bg-neutral-700/75 dark:hover:text-white sm:text-lg',
        isActive && 'bg-black text-white dark:bg-white dark:text-black',
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
