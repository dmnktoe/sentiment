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
import { Paragraph, Title } from '@/components/ui/typography';

import { Homepage } from '@/types/Homepage';

function ProminentText() {
  return (
    <div className='z-20 col-span-3 sm:col-span-4'>
      <Title className='leading-none' size='two'>
        Creating{' '}
        <span className='font-secondary italic text-primary'>Safe</span> &
        <span className='font-secondary italic text-primary'> Supportive</span>{' '}
        Spaces for Intimate Communication with Human-Chatbot Interactions
      </Title>
    </div>
  );
}

function HeroText({ heroText }: { heroText: string }) {
  return (
    <div className='z-10 col-span-3 mb-8 sm:col-span-4'>
      <Paragraph>{heroText}</Paragraph>
      <Button href='/about'>More</Button>
    </div>
  );
}

function HeroImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div className='z-10 col-span-3 mb-8 sm:col-span-4'>
      <Image
        alt='Sentiment explores the delicate intersection of privacy and intimacy in human-chatbot interactions.'
        width='1000'
        height='600'
        src={getStrapiMedia(imageUrl)}
        className='w-full object-cover'
        priority
      />
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
            className='rounded-full hover:bg-secondary/20'
          >
            <div className='mx-auto w-2/3 dark:grayscale dark:invert dark:brightness-150'>
              {partner.icon}
            </div>
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
            <div className='border-b-solid mb-12 border-b-[1px] border-b-grid pb-12 sm:mb-24 sm:pb-24'>
              <div className='grid grid-cols-3 gap-0 sm:grid-cols-4'>
                <ProminentText />
                <HeroText heroText={content.heroText} />
                <HeroImage imageUrl={content.heroCoverImage.url} />
              </div>
            </div>
            <Partners />
          </div>
        </Container>
      </section>
    </>
  );
}
