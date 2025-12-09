'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  BMBFIcon,
  RUBIcon,
  UniDUEIcon,
  UniKasselIcon,
} from 'src/components/ui/icons';

import { getStrapiMedia } from '@/lib/strapi-urls';

import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Button } from '@/components/ui/Button';
import Paragraph from '@/components/ui/typography/Paragraph';
import { Title } from '@/components/ui/typography/Title';

import { Homepage } from '@/types/Homepage';

function Text({ content }: { content: Homepage }) {
  function ProminentText() {
    return (
      <div className='z-20 col-span-3 sm:col-span-4'>
        <Title className='leading-none' size='two'>
          Creating{' '}
          <span className='font-secondary text-primary italic'>Safe</span> &
          <span className='font-secondary text-primary italic'>
            {' '}
            Supportive
          </span>{' '}
          Spaces for Intimate Communication with Human-Chatbot Interactions
        </Title>
      </div>
    );
  }

  function HeroText() {
    return (
      <div className='z-10 col-span-3 mb-8 sm:col-span-4'>
        <Paragraph>{content.heroText}</Paragraph>
        <Button href='/about'>More</Button>
      </div>
    );
  }

  function HeroImage() {
    return (
      <div className='z-10 col-span-3 mb-8 sm:col-span-4'>
        <Image
          alt='Sentiment explores the delicate intersection of privacy and intimacy in human-chatbot interactions.'
          width='1000'
          height='600'
          src={getStrapiMedia(content.heroCoverImage.url)}
          className='w-full object-cover'
          priority
        />
      </div>
    );
  }

  return (
    <div className='border-b-solid border-b-grid mb-12 border-b-[1px] pb-12 sm:mb-24 sm:pb-24'>
      <div className='grid grid-cols-3 gap-0 sm:grid-cols-4'>
        <ProminentText />
        <HeroText />
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
  return (
    <>
      <div className='grid grid-cols-2 grid-rows-2 gap-0 gap-y-8 sm:grid-cols-4 sm:grid-rows-1'>
        {partners.map((partner, index) => (
          <Link
            key={index}
            href={partner.url}
            target='_blank'
            className='hover:bg-secondary/20 rounded-full'
          >
            <div className='mx-auto w-2/3'>{partner.icon}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function HeroIntro({ content }: { content: Homepage }) {
  return (
    <>
      <section className='pt-24 pb-24 sm:pt-36'>
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
