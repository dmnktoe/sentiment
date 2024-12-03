import Link from 'next/link';

import { Logo } from '@/components/ui/icons/Logo';
import NavLink from '@/components/ui/NavLink';

const navLinks = [
  { href: '/', text: 'Main' },
  { href: '/about', text: 'Story' },
  { href: '/articles', text: 'Articles' },
  { href: '/projects', text: 'Projects' },
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
      <div className='pointer-events-auto relative mt-8 flex items-center justify-between gap-4 overflow-hidden rounded-full border-[1px] border-solid border-[#e9e9e9] bg-white/85 px-2 py-2 pl-4 shadow-sm backdrop-blur-md'>
        <Link
          href='/'
          className='text-primary ease-in-out hover:text-secondary'
        >
          <Logo className='w-20 sm:w-32' variant='textOnly' />
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
