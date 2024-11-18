import Link from 'next/link';

import { Logo } from '@/components/ui/Icons/Logo';
import NavLink from '@/components/ui/NavLink';

const navLinks = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/articles', text: 'Articles' },
  { href: '/projects', text: 'Projects' },
];

function Navigation() {
  return (
    <nav>
      <ul className='flex flex-row gap-3 text-sm sm:text-lg'>
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
    <header className='bg-[#0000] justify-center w-full flex fixed z-30'>
      <div className='backdrop-blur-md pointer-events-auto bg-white/85 items-center flex relative shadow-sm mt-8 px-5 py-1 rounded-full gap-2 justify-between overflow-hidden border-[1px] border-solid border-[#e9e9e9]'>
        <Link
          href='/'
          className='hover:text-primary hover:-rotate-12 hover:scale-125 transform transition ease-in-out active:scale-90 active:text-secondary'
        >
          <Logo className='h-8 w-8' />
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
