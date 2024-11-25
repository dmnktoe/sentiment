import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { BMBFIcon } from '@/components/ui/icons/BMBF';
import { Logo } from '@/components/ui/icons/Logo';

export default function Footer() {
  return (
    <footer className='border-t-solid border-t-4 border-primary/30 py-24'>
      <Container>
        <div className='grid grid-cols-3 gap-y-8 sm:grid-cols-4 sm:gap-0'>
          <div className='col-span-3 sm:col-span-1'>
            <Logo />
            <span className='mt-7 block text-justify text-sm text-tertiary'>
              {new Date().getFullYear()} SENTIMENT explores the delicate
              intersection of privacy and intimacy in human-chatbot
              interactions. As conversational AI systems become more lifelike,
              the boundaries between human and machine blur, prompting users to
              share sensitive, personal moments.
            </span>
          </div>
          <div className='col-span-1 hidden sm:block'></div>
          <div className='col-span-1'>
            <h4 className='mb-7 text-lg font-medium text-gray-900'>
              Resources
            </h4>
            <ul className='text-sm transition-all duration-500'>
              <li className='mb-3'>
                <Link
                  href='/legal-notice'
                  className='text-tertiary hover:text-gray-900'
                >
                  Legal Notice
                </Link>
              </li>
              <li className='mb-3'>
                <a className='text-tertiary hover:text-gray-900'>Privacy</a>
              </li>
              <li className='mb-3'>
                <a className='text-tertiary hover:text-gray-900'>
                  Cookie Settings
                </a>
              </li>
              <li>
                <a className='text-tertiary hover:text-gray-900'>Features</a>
              </li>
            </ul>
          </div>
          <div className='col-span-2 sm:col-span-1'>
            <h4 className='mb-7 text-lg font-medium text-gray-900'>
              Gefördert durch
            </h4>
            <div className='w-1/2'>
              <BMBFIcon />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
