'use client';

import Image from 'next/image';

import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { getStrapiMedia } from '@/lib/strapi-urls';

import BlockRendererClient from '@/components/helpers/BlockRendererClient';
import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Title } from '@/components/ui/typography/Title';

import { Article } from '@/types/Article';

interface ArticleProps {
  article: Article;
}

function ArticleHeader({ article }: ArticleProps) {
  return (
    <>
      <div className='col-span-4 flex flex-col gap-4'>
        <Title renderAs='h1' size='two' margin={false}>
          {article.title}
        </Title>
      </div>
      <div className='col-span-4 mb-4 grid grid-cols-3 gap-0 text-sm text-primary sm:grid-cols-4'>
        <div className='text-sm text-primary'>{article.author}</div>
        <div className='text-sm text-primary'>
          {formatDate(article.publishedAt)}
        </div>
        <div className='text-sm text-primary'>
          {readingDuration(article.description)}
        </div>
      </div>
      <div className='col-span-4 mb-4 gap-0 text-sm'>
        <div>
          <strong>Category</strong>:{' '}
          <span className='text-primary'>{article.tags}</span>
        </div>
        <div>Keywords: {article.tags}</div>
      </div>
      <div className='col-span-4'>
        <div className='prose'>{article.description}</div>
      </div>
      {article?.image?.url && (
        <div className='col-span-4'>
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
          <div className='px-2 sm:px-4'>
            {/* Article Content Grid */}
            <div className='grid grid-cols-3 gap-0 gap-y-6 sm:grid-cols-4'>
              <ArticleHeader article={article} />
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
