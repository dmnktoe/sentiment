import Link from 'next/link';

import { Logo } from '@/components/ui/icons/Logo';
import NavLink from '@/components/ui/NavLink';

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
      <div className='pointer-events-auto relative mt-8 flex items-center justify-between gap-8 overflow-hidden rounded-full border-[1px] border-solid border-black bg-white/85 px-2 py-2 pl-4 shadow-sm backdrop-blur-md sm:gap-32'>
        <Link href='/' className='hover:text-primary text-black ease-in-out'>
          <Logo className='w-24 sm:w-48' variant='textOnly' />
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
