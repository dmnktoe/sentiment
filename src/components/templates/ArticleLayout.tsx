import Image from 'next/image';

import BlockRendererClient from '@/components/helpers/BlockRendererClient';
import { Title } from '@/components/ui/typography/Title';
import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { getStrapiMedia } from '@/lib/strapi-urls';
import { Article } from '@/types/Article';

interface ArticleProps {
  article: Article;
}

function ArticleSidebar() {
  return (
    <div className='col-span-3 sm:col-span-1 sm:col-start-4'>
      <ul className='space-y-2 text-sm bg-secondary/15 p-4 rounded-full'>
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
          <span className='font-semibold'>Institutional Affiliation:</span> University of Cyber Research
        </li>
        <li>
          <span className='font-semibold'>Funding:</span> CyberTech Grant Program
        </li>
        <li>
          <span className='font-semibold'>Keywords:</span> Data Security, Privacy, AI Encryption
        </li>
      </ul>
    </div>
  );
}

function ArticleInfo({ article }: ArticleProps) {
  return (
    <>
      <div className='text-sm text-primary'>(News)</div>
      <div className='text-sm text-primary'>{formatDate(article.publishedAt)}</div>
      <div className='text-sm text-primary'>{readingDuration(article.description)}</div>
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
              className='block w-full h-[300px] object-cover'
            />
          </div>
        </div>
      )}
      <div className='col-span-4 flex flex-col gap-4'>
        <Title size='three' margin={false}>
          {article.title}
        </Title>
      </div>
      <div className='col-span-3 sm:col-span-2'>
        <div className='text-primary text-sm mb-4'>Written by Dr. Jessica Szczuka</div>
        <div className='prose text-tertiary text-justify text-sm'>{article.description}</div>
      </div>
    </>
  );
}

export default function ArticleLayout({ article }: ArticleProps) {
  return (
    <>
      {/* Article Info Grid */}
      <div className='grid grid-cols-3 sm:grid-cols-4 mb-6'>
        <ArticleInfo article={article} />
      </div>

      {/* Article Content Grid */}
      <div className='grid grid-cols-3 sm:grid-cols-4 gap-0 gap-y-6'>
        <ArticleHeader article={article} />
        <ArticleSidebar />
        <div className='col-span-3 sm:col-span-3'>
          <BlockRendererClient content={article.content} />
        </div>
      </div>
    </>
  );
}
