import { Container } from '@/components/layout/Container';
import { BMBFIcon } from '@/components/ui/Icons/BMBF';
import { Logo } from '@/components/ui/Icons/Logo';

export default function Footer() {
  return (
    <footer className='py-24'>
      <Container>
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-0'>
          <div className='col-span-1'>
            <Logo />
            <span className='text-tertiary text-sm mt-7 block text-justify'>
              {new Date().getFullYear()} SENTIMENT explores the delicate intersection of privacy and intimacy in
              human-chatbot interactions. As conversational AI systems become more lifelike, the boundaries between
              human and machine blur, prompting users to share sensitive, personal moments.
            </span>
          </div>

          <div className='col-span-1 hidden sm:block'></div>
          <div className='col-span-1'>
            <h4 className='text-lg text-gray-900 font-medium mb-7'>Resources</h4>
            <ul className='text-sm  transition-all duration-500'>
              <li className='mb-3'>
                <a className='text-tertiary hover:text-gray-900'>Legal Notice</a>
              </li>
              <li className='mb-3'>
                <a className=' text-tertiary hover:text-gray-900'>Privacy</a>
              </li>
              <li className='mb-3'>
                <a className=' text-tertiary hover:text-gray-900'>Cookie Settings</a>
              </li>
              <li>
                <a className='text-tertiary hover:text-gray-900'>Features</a>
              </li>
            </ul>
          </div>
          <div className='col-span-1'>
            <h4 className='text-lg text-gray-900 font-medium mb-7'>Gefördert durch</h4>
            <div className='w-1/2'>
              <BMBFIcon />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
