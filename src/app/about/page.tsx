import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { Title } from '@/components/ui/typography/Title';

export default function AboutPage() {
  return (
    <section className='py-36 sm:py-48'>
      <Container>
        <Title className='leading-none'>
          About
          <span className='text-primary font-secondary italic'> »</span> Project{' '}
          <span className='text-white rounded-full px-3 relative inline-flex items-center overflow-hidden'>
            <video
              controls={false}
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
              className='absolute left-0 top-0 w-full h-full object-cover'
              src='/video/sentiment-bg-pill.mp4'
            />
            <span className='z-20'>Sentiment</span>
          </span>{' '}
          <span className='text-primary font-secondary italic'>(dot) org</span>, - IT Security Protects Privacy and
          Supports Democracy
          <span className='text-primary font-secondary italic'> «</span>
        </Title>
        <p className='mt-8 text-sm text-tertiary text-justify'>
          The project is a non-profit organization that aims to protect the privacy of individuals and support democracy
          by providing IT security solutions. We are a team of IT security experts who are passionate about protecting
          the privacy of individuals and supporting democracy. Our mission is to provide IT security solutions that
          protect the privacy of individuals and support democracy. We believe that everyone has the right to privacy
          and that democracy is essential for a free and open society. We are committed to providing IT security
          solutions that help protect the privacy of individuals and support democracy.
        </p>
        <div className='mt-24 mb-16 grid grid-cols-3 sm:grid-cols-4'>
          <div className='col-span-2 pr-8 sm:pr-0 sm:col-span-1'>
            <Title size='three' className='leading-none'>
              Mission
            </Title>
            <p>
              Our mission is to provide IT security solutions that protect the privacy of individuals and support
              democracy. We believe that everyone has the right to privacy and that democracy is essential for a free
              and open society. We are committed to providing IT security solutions that help protect the privacy of
              individuals and support democracy.
            </p>
          </div>
          <div className='hidden col-span-1 sm:col-span-1 sm:col-start-3 sm:block'>
            <Image
              src='/images/about/about-4.jpg'
              alt='SENTIMENT Logo'
              width={1000}
              height={1000}
              className='h-[300px] sm:h-[400px] w-full object-cover mt-16'
            />
          </div>
          <div className='col-start-3 sm:col-span-1 sm:col-start-4'>
            <Image
              src='/images/about/about-3.jpg'
              alt='SENTIMENT Logo'
              width={1000}
              height={1000}
              className='h-[300px] sm:h-[400px] w-full object-cover -mt-4'
            />
          </div>
        </div>
        <div className='col-span-1 col-start-3'>
          <Title size='three' className='leading-none'>
            Vision
          </Title>
          <p>
            By IT security solutions. We believe that IT security is essential for protecting the privacy of individuals
            and supporting democracy. We are committed to creating a world where everyone can communicate freely and
            securely.
          </p>
        </div>
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-0 mt-8'>
          <div className='col-span-1'>
            <Title size='five' className='leading-none'>
              Partners
            </Title>
            <ul className='list-disc list-inside text-sm underline'>
              <li>Bundesministerium für Bildung und Forschung - BMBF</li>
              <li>Ruhr-Universität Bochum</li>
              <li>Uni Duisburg-Essen</li>
              <li>Universität Kassel</li>
            </ul>
          </div>
          <div className='col-span-1'>
            <Title size='five' className='leading-none'>
              Funding
            </Title>
            <ul className='list-disc list-inside'>
              <li>Funding 1</li>
              <li>Funding 2</li>
              <li>Funding 3</li>
              <li>Funding 4</li>
            </ul>
          </div>
          <div className='col-span-1'>
            <Title size='five' className='leading-none'>
              Contact
            </Title>
            <ul className='list-disc list-inside'>
              <li>Contact 1</li>
              <li>Contact 2</li>
              <li>Contact 3</li>
              <li>Contact 4</li>
            </ul>
          </div>
          <div className='col-span-1'>
            <Title size='five' className='leading-none'>
              Social Media
            </Title>
            <ul className='list-disc list-inside'>
              <li>Social Media 1</li>
              <li>Social Media 2</li>
              <li>Social Media 3</li>
              <li>Social Media 4</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
