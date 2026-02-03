import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/ui/icons/Logo';
import { Link } from '@/components/ui/Link';

export default function Footer() {
  return (
    <footer className='border-t-solid border-t-4 border-primary/30 py-24'>
      <Container>
        <div className='px-2 sm:px-4'>
          <div className='grid grid-cols-3 gap-y-8 sm:grid-cols-4 sm:gap-0'>
            <div className='col-span-3 sm:col-span-1'>
              <Link
                href='/'
                className='text-black ease-in-out hover:text-primary'
              >
                <Logo variant='logoWithText' />
              </Link>
            </div>
            <div className='col-span-1 hidden sm:block'></div>
            <div className='col-span-1'></div>
            <div className='col-span-2 sm:col-span-1'>
              <ul className='text-right text-lg'>
                <li>
                  <Link href='/legal-notice' className='hover:underline'>
                    impressum
                  </Link>
                </li>
                <li>
                  <Link href='/privacy' className='hover:underline'>
                    datenschutz
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='hover:underline'>
                    contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
