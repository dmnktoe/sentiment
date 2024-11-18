'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsxm from '@/lib/clsxm';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link href={href} className={clsxm('hover:underline hover:text-primary', isActive && 'underline')}>
      {children}
    </Link>
  );
};

export default NavLink;
