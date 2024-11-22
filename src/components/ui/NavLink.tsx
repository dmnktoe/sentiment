'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        'px-2 py-1 rounded-2xl hover:bg-neutral-200/75 text-base',
        isActive && 'bg-secondary/20 text-text line-through'
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
