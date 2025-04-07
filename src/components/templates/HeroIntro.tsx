'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  BMBFIcon,
  RUBIcon,
  UniDUEIcon,
  UniKasselIcon,
} from 'src/components/ui/icons';

import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Button } from '@/components/ui/Button';
import Paragraph from '@/components/ui/typography/Paragraph';
import { Title } from '@/components/ui/typography/Title';
import { getStrapiMedia } from '@/lib/strapi-urls';
import { Homepage } from '@/types/Homepage';

function Text({ content }: { content: Homepage }) {
  function LargeText() {
    return (
      <div className='z-20 col-span-6'>
        <Title className='leading-none' size='two'>
          Creating{' '}
          <span className='font-secondary italic text-primary'>Safe</span> &
          <span className='font-secondary italic text-primary'>
            {' '}
            Supportive
          </span>{' '}
          Spaces for Intimate Communication with Human-Chatbot Interactions
        </Title>
      </div>
    );
  }

  function HeroImage() {
    return (
      <div className='z-10 col-span-3 mb-8 sm:col-span-4'>
        <Image
          alt='SENTIMENT Logo'
          width='1000'
          height='600'
          src={getStrapiMedia(content.heroTinyImage.url)}
          className='w-full object-cover'
        />
      </div>
    );
  }

  return (
    <div className='border-b-solid mb-12 border-b-[1px] border-b-grid pb-12 sm:mb-24 sm:pb-24'>
      <div className='grid grid-cols-3 gap-0 sm:grid-cols-4'>
        <LargeText />
        <div className='col-span-3 mb-12 sm:col-span-4'>
          <Paragraph>{content.heroSecondText}</Paragraph>
          <Button href={'/about'}>More</Button>
        </div>
        <HeroImage />
      </div>
    </div>
  );
}

const partners = [
  {
    name: 'BMBF',
    url: 'https://www.bmbf.de/',
    icon: <BMBFIcon />,
  },
  {
    name: 'RUB',
    url: 'https://www.ruhr-uni-bochum.de/',
    icon: <RUBIcon />,
  },
  {
    name: 'UniDUE',
    url: 'https://www.uni-due.de/',
    icon: <UniDUEIcon />,
  },
  {
    name: 'UniKassel',
    url: 'https://www.uni-kassel.de/',
    icon: <UniKasselIcon />,
  },
];

function Partners() {
  // const string = '(Backed) and (funded) by';
  return (
    <>
      {/*<div className='mb-4 grid grid-cols-3 text-xs text-primary sm:grid-cols-4'>
        {string.split(' ').map((word, index) => (
          <span key={index} className='col-span-1'>
            {word}
          </span>
        ))}
      </div>*/}
      <div className='grid grid-cols-2 grid-rows-2 gap-0 gap-y-8 sm:grid-cols-4 sm:grid-rows-1'>
        {partners.map((partner, index) => (
          <Link
            key={index}
            href={partner.url}
            target='_blank'
            className='rounded-full hover:bg-secondary/20'
          >
            <div className='w-2/3'>{partner.icon}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function HeroIntro({ content }: { content: Homepage }) {
  return (
    <>
      <section className='pb-24 pt-24 sm:pt-36'>
        <Container>
          <Crossbar />
          <div className='px-2 sm:px-4'>
            <Text content={content} />
            <Partners />
          </div>
        </Container>
      </section>
    </>
  );
}
