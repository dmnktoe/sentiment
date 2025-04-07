'use client';

import Image from 'next/image';

import BlockRendererClient from '@/components/helpers/BlockRendererClient';
import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Title } from '@/components/ui/typography/Title';
import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { getStrapiMedia } from '@/lib/strapi-urls';
import { Article } from '@/types/Article';

interface ArticleProps {
  article: Article;
}

function ArticleSidebar({ article }: ArticleProps) {
  return (
    <div className='col-span-3 sm:col-span-1 sm:col-start-4'>
      <ul className='space-y-2 rounded-full bg-secondary/15 p-4 text-sm'>
        <li>
          <span className='font-semibold'>Category:</span> Data Security
        </li>
        <li>
          <span className='font-semibold'>Word Count:</span> 2,450 words
        </li>
        <li>
          <span className='font-semibold'>Peer Reviewed:</span> Yes
        </li>
        <li>
          <span className='font-semibold'>Institutional Affiliation:</span>{' '}
          University of Cyber Research
        </li>
        <li>
          <span className='font-semibold'>Funding:</span> CyberTech Grant
          Program
        </li>
        <li>
          <span className='font-semibold'>Keywords:</span> {article.tags}
        </li>
      </ul>
    </div>
  );
}

function ArticleInfo({ article }: ArticleProps) {
  return (
    <>
      <div className='text-sm text-primary'>(News)</div>
      <div className='text-sm text-primary'>
        {formatDate(article.publishedAt)}
      </div>
      <div className='text-sm text-primary'>
        {readingDuration(article.description)}
      </div>
    </>
  );
}

function ArticleHeader({ article }: ArticleProps) {
  return (
    <>
      {article?.image?.url && (
        <div className='col-span-3'>
          <div className='w-full'>
            <Image
              src={getStrapiMedia(article.image.url ?? '')}
              blurDataURL={getStrapiMedia(article.image.url ?? '')}
              placeholder='blur'
              alt={article.title}
              width={1600}
              height={600}
              className='block h-[300px] w-full object-cover'
            />
          </div>
        </div>
      )}
      <div className='col-span-4 flex flex-col gap-4'>
        <Title renderAs='h1' size='two' margin={false}>
          {article.title}
        </Title>
      </div>
      <div className='col-span-3 sm:col-span-2'>
        <div className='mb-4 text-sm text-primary'>
          Written by {article.author}
        </div>
        <div className='prose text-sm text-tertiary'>{article.description}</div>
      </div>
    </>
  );
}

export default function ArticleLayout({ article }: ArticleProps) {
  return (
    <>
      <section className='py-24 sm:py-36'>
        <Container>
          <Crossbar />
          {/* Article Info Grid */}
          <div className={'px-2 sm:px-4'}>
            <div className='mb-6 grid grid-cols-3 sm:grid-cols-4'>
              <ArticleInfo article={article} />
            </div>
            {/* Article Content Grid */}
            <div className='grid grid-cols-3 gap-0 gap-y-6 sm:grid-cols-4'>
              <ArticleHeader article={article} />
              <ArticleSidebar article={article} />
              <div className='col-span-3 sm:col-span-3'>
                <BlockRendererClient content={article.content} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
