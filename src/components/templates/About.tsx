import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import Paragraph from '@/components/ui/typography/Paragraph';
import { Title } from '@/components/ui/typography/Title';

function AboutHero() {
  return (
    <>
      <Title className='leading-none'>
        About
        <span className='font-secondary italic text-primary'>
          {' '}
          »
        </span> Project{' '}
        <span className='relative inline-flex items-center overflow-hidden rounded-full px-3 text-white'>
          <video
            controls={false}
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            className='absolute left-0 top-0 h-full w-full object-cover'
            src='/video/sentiment-bg-pill.mp4'
          />
          <span className='z-20'>Sentiment</span>
        </span>{' '}
        <span className='font-secondary italic text-primary'>(dot) org</span>, -
        IT Security Protects Privacy and Supports Democracy
        <span className='font-secondary italic text-primary'> «</span>
      </Title>
      <Paragraph size='sm' color='light' margin={false} isJustify>
        The project is a non-profit organization that aims to protect the
        privacy of individuals and support democracy by providing IT security
        solutions. We are a team of IT security experts who are passionate about
        protecting the privacy of individuals and supporting democracy. Our
        mission is to provide IT security solutions that protect the privacy of
        individuals and support democracy. We believe that everyone has the
        right to privacy and that democracy is essential for a free and open
        society. We are committed to providing IT security solutions that help
        protect the privacy of individuals and support democracy.
      </Paragraph>
    </>
  );
}

function AboutText() {
  return (
    <>
      <div className='mb-16 mt-24 grid grid-cols-3 sm:grid-cols-4'>
        <div className='col-span-2 pr-8 sm:col-span-1 sm:pr-0'>
          <Title size='three' className='leading-none'>
            Our mission is to provide IT security
          </Title>
          <Paragraph>
            Our mission is to provide IT security solutions that protect the
            privacy of individuals and support democracy. We believe that
            everyone has the right to privacy and that democracy is essential
            for a free and open society. We are committed to providing IT
            security solutions that help protect the privacy of individuals and
            support democracy.
          </Paragraph>
        </div>
        <div className='col-span-1 hidden sm:col-span-1 sm:col-start-3 sm:block'>
          <Image
            src='/images/about/about-4.jpg'
            alt='SENTIMENT Logo'
            width={1000}
            height={1000}
            className='mt-16 h-[300px] w-full object-cover sm:h-[400px]'
          />
        </div>
        <div className='col-start-3 sm:col-span-1 sm:col-start-4'>
          <Image
            src='/images/about/about-3.jpg'
            alt='SENTIMENT Logo'
            width={1000}
            height={1000}
            className='-mt-4 h-[300px] w-full object-cover sm:h-[400px]'
          />
        </div>
      </div>
      <div className='col-span-1 col-start-3 mt-36'>
        <Title size='three' className='leading-none'>
          Protecting the privacy of individuals
        </Title>
        <Paragraph>
          By IT security solutions. We believe that IT security is essential for
          protecting the privacy of individuals and supporting democracy. We are
          committed to creating a world where everyone can communicate freely
          and securely. By IT security solutions. We believe that IT security is
          essential for protecting the privacy of individuals and supporting
          democracy. We are committed to creating a world where everyone can
          communicate freely and securely.
        </Paragraph>
      </div>
    </>
  );
}

function AboutFooter() {
  return (
    <div className='mt-16 grid grid-cols-3 gap-y-8 sm:grid-cols-4 sm:gap-0'>
      <div className='col-span-1'>
        <Title size='five' className='leading-none'>
          Partners
        </Title>
        <ul className='list-inside text-sm'>
          <li>BMBF</li>
          <li>Ruhr-Universität Bochum</li>
          <li>Uni Duisburg-Essen</li>
          <li>Universität Kassel</li>
        </ul>
      </div>
      <div className='col-span-1'>
        <Title size='five' className='leading-none'>
          Funding
        </Title>
        <ul className='list-inside text-sm'>
          <li>MC</li>
          <li>QA</li>
          <li>SH</li>
        </ul>
      </div>
      <div className='col-span-1'>
        <Title size='five' className='leading-none'>
          Contact
        </Title>
        <ul className='list-inside text-sm'>
          <li>E-Mail</li>
          <li>Phone</li>
        </ul>
      </div>
      <div className='col-span-1'>
        <Title size='five' className='leading-none'>
          Social Media
        </Title>
        <ul className='list-inside text-sm'>
          <li>LinkedIn</li>
          <li>Instagram</li>
          <li>TikTok</li>
        </ul>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <AboutHero />
        <AboutText />
        <AboutFooter />
      </Container>
    </section>
  );
}
