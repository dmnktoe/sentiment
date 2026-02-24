import Link from 'next/link';

import { Logo } from '@/components/ui/icons/Logo';
import NavLink from '@/components/ui/NavLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navLinks = [
  { href: '/about', text: 'About' },
  { href: '/team', text: 'Team' },
  { href: '/articles', text: 'Articles' },
];

function Navigation() {
  return (
    <nav>
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
  return (
    <header className='pointer-events-none fixed z-30 flex w-full justify-center'>
      <div className='pointer-events-auto relative mt-8 flex items-center justify-between gap-3 overflow-hidden rounded-full border-[1px] border-solid border-black bg-white/85 px-2 py-2 pl-4 shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-neutral-950/85 sm:gap-32'>
        <Link
          href='/'
          className='text-black ease-in-out hover:text-primary dark:text-white dark:hover:text-primary'
        >
          <Logo className='w-24 sm:w-48' variant='textOnly' />
        </Link>
        <div className='flex items-center gap-1'>
          <Navigation />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
