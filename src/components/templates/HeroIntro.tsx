'use client';

import Image from 'next/image';
import { useScramble } from 'use-scramble';

import { Container } from '@/components/layout/Container';
import { BMBFIcon, Logo, RUBIcon, UniDUEIcon, UniKasselIcon } from '@/components/ui/Icons';

function Text() {
  function LargeText() {
    return (
      <div className='col-span-6 z-20'>
        <h1 className='text-4xl sm:text-7xl leading-none tracking-tighter mb-4'>
          Sentiment: Creating
          <span className='text-primary font-secondary italic'> Safe</span> &
          <span className='text-primary font-secondary italic'> Supportive</span> Spaces for Intimate Communication with
          Human-Chatbot <Logo className='inline w-10 -mt-1.5 sm:w-20 sm:-mt-4 text-secondary' />
          Interactions
        </h1>
      </div>
    );
  }

  function SmallText() {
    const { ref } = useScramble({
      text: 'Research Project',
    });
    return (
      <div className='col-span-2 sm:col-span-1 mb-8 text-sm z-10'>
        <p className='font-secondary italic underline' ref={ref} />
        <span className='text-tertiary text-sm mt-7 block text-justify'>
          {new Date().getFullYear()} SENTIMENT explores the delicate intersection of privacy and intimacy in
          human-chatbot interactions. As conversational AI systems become more lifelike, the boundaries between human
          and machine blur, prompting users to share sensitive, personal moments.
        </span>
        <br />
        <span className='font-primary text-tertiary'>2024 — 2027</span>
        <Image
          alt='SENTIMENT Logo'
          width='400'
          height='200'
          src='/images/hero/sentiment_hero_image_1.webp'
          className='sm:mt-24'
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
          className='sm:-mt-12'
        />
      </div>
    );
  }

  return (
    <div className='border-b-[#f2f2f2] border-b-solid border-b-[1px] mb-12 pb-12 sm:mb-24 sm:pb-24'>
      <div className='grid grid-cols-3 sm:grid-cols-4 gap-0'>
        <LargeText />
        <SmallText />
        <LargeImg />
        <div className='col-span-4 sm:col-span-3 row-start-3'>
          <p className='text-justify text-tertiary text-sm'>
            SENTIMENT explores the delicate intersection of privacy and intimacy in human-chatbot interactions. As
            conversational AI systems become more lifelike, the boundaries between human and machine blur, prompting
            users to share sensitive, personal moments. Our interdisciplinary team delves into the risks and ethical
            challenges of such interactions, designing innovative Privacy-by-Design solutions to safeguard personal data
            and empower users in their digital experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

function Partners() {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 grid-rows-2 sm:grid-rows-1 gap-y-8 gap-0'>
      <div className='w-2/3'>
        <BMBFIcon />
      </div>
      <div className='w-2/3'>
        <RUBIcon />
      </div>
      <div className='w-2/3'>
        <UniDUEIcon />
      </div>
      <div className='w-2/3 col-start-2 sm:col-start-4'>
        <UniKasselIcon />
      </div>
    </div>
  );
}

export default function HeroIntro() {
  return (
    <>
      <section className='pt-36 sm:pt-48 pb-24'>
        <Container>
          <Text />
          <Partners />
        </Container>
      </section>
    </>
  );
}
