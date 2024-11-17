import { Logo } from '@/components/ui/Icons/Logo';

function Navigation() {
  return (
    <nav>
      <ul className='flex flex-row gap-3 text-sm sm:text-lg'>
        <li>
          <a className='hover:underline' href='/contact'>
            Projects
          </a>
        </li>
        <li>
          <a className='hover:underline' href='/contact'>
            Articles
          </a>
        </li>
        <li>
          <a className='hover:underline' href='/about'>
            Studies
          </a>
        </li>
        <li>
          <a className='hover:underline' href='/contact'>
            Team
          </a>
        </li>
        <li>
          <a className='hover:underline' href='/contact'>
            •••
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default function Header() {
  return (
    <header className='bg-[#0000] justify-center w-full flex fixed z-30'>
      <div className='backdrop-blur-md pointer-events-auto bg-white/85 items-center flex relative shadow-sm mt-8 px-5 py-1 rounded-full gap-8 justify-between overflow-hidden border-[1px] border-solid border-[#e9e9e9]'>
        <a href='/' className='hover:text-primary hover:-rotate-12 hover:scale-125 transform transition ease-in-out'>
          <Logo className='h-8 w-8' />
        </a>
        <Navigation />
      </div>
    </header>
  );
}
