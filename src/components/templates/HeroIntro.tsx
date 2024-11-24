'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScramble } from 'use-scramble';

import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import {
  BMBFIcon,
  Logo,
  RUBIcon,
  UniDUEIcon,
  UniKasselIcon,
} from '@/components/ui/Icons';
import Paragraph from '@/components/ui/typography/Paragraph';
import { Title } from '@/components/ui/typography/Title';

function Text() {
  function LargeText() {
    return (
      <div className='z-20 col-span-6'>
        <Title className='leading-none'>
          Sentiment: Creating
          <span className='font-secondary italic text-primary'> Safe</span> &
          <span className='font-secondary italic text-primary'>
            {' '}
            Supportive
          </span>{' '}
          Spaces for Intimate Communication with Human-Chatbot{' '}
          <Logo className='-mt-1.5 inline w-10 text-secondary sm:-mt-4 sm:w-20' />
          Interactions
        </Title>
      </div>
    );
  }

  function SmallText() {
    const { ref } = useScramble({
      text: 'Research Project',
    });
    return (
      <div className='z-10 col-span-2 mb-8 text-sm sm:col-span-1'>
        <p className='font-secondary italic underline' ref={ref}>
          &nbsp;
        </p>
        <Paragraph isJustify color='light' size='sm' className='mt-4 block'>
          {new Date().getFullYear()} SENTIMENT explores the delicate
          intersection of privacy and intimacy in human-chatbot interactions. As
          conversational AI systems become more lifelike, the boundaries between
          human and machine blur, prompting users to share sensitive, personal
          moments.
        </Paragraph>
        <Paragraph color='light' size='sm'>
          2024 — 2027
        </Paragraph>
        <Image
          alt='SENTIMENT Logo'
          width='400'
          height='200'
          src='/images/hero/sentiment_hero_image_1.webp'
          className='w-full object-cover sm:mt-24'
        />
      </div>
    );
  }

  function LargeImg() {
    return (
      <div className='col-span-2 col-start-3 mb-8 hidden sm:block'>
        <Image
          alt='SENTIMENT Lecture'
          width='600'
          height='200'
          src='/images/hero/sentiment_hero_image_2.webp'
          className='w-full object-cover sm:-mt-12'
        />
      </div>
    );
  }

  return (
    <div className='border-b-solid mb-12 border-b-[1px] border-b-grid pb-12 sm:mb-24 sm:pb-24'>
      <div className='grid grid-cols-3 gap-0 sm:grid-cols-4'>
        <LargeText />
        <SmallText />
        <LargeImg />
        <div className='col-span-4 row-start-3 sm:col-span-3'>
          <Paragraph isJustify color='light' size='sm'>
            SENTIMENT explores the delicate intersection of privacy and intimacy
            in human-chatbot interactions. As conversational AI systems become
            more lifelike, the boundaries between human and machine blur,
            prompting users to share sensitive, personal moments. Our
            interdisciplinary team delves into the risks and ethical challenges
            of such interactions, designing innovative Privacy-by-Design
            solutions to safeguard personal data and empower users in their
            digital experiences.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}

function Partners() {
  return (
    <>
      <div className='mb-4 grid grid-cols-3 text-xs text-primary sm:grid-cols-4'>
        <div>(Unterstützt)</div>
        <div>und</div>
        <div>(gefördert)</div>
        <div>durch</div>
      </div>
      <div className='grid grid-cols-2 grid-rows-2 gap-0 gap-y-8 sm:grid-cols-4 sm:grid-rows-1'>
        <Link
          href='https://www.bmbf.de/'
          target='_blank'
          className='rounded-full hover:bg-secondary/20'
        >
          <div className='w-2/3'>
            <BMBFIcon />
          </div>
        </Link>
        <Link
          href='https://www.ruhr-uni-bochum.de/'
          target='_blank'
          className='rounded-full hover:bg-secondary/20'
        >
          <div className='w-2/3'>
            <RUBIcon />
          </div>
        </Link>
        <Link
          href='https://www.uni-due.de/'
          target='_blank'
          className='rounded-full hover:bg-secondary/20'
        >
          <div className='w-2/3'>
            <UniDUEIcon />
          </div>
        </Link>
        <Link
          href='https://www.uni-kassel.de/'
          target='_blank'
          className='rounded-full hover:bg-secondary/20'
        >
          <div className='col-start-2 w-2/3 sm:col-start-4'>
            <UniKasselIcon />
          </div>
        </Link>
      </div>
    </>
  );
}

export default function HeroIntro() {
  return (
    <>
      <section className='pb-24 pt-24 sm:pt-36'>
        <Container>
          <Crossbar />
          <Text />
          <Partners />
        </Container>
      </section>
    </>
  );
}
