import Link from 'next/link';
import { Key } from 'react';

import { Container } from '@/components/layout/Container';
import { Title } from '@/components/ui/typography/Title';
import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { Article } from '@/types/Article';

function LatestCard({
  title,
  publishedAt,
  slug,
  description,
}: {
  title: string;
  publishedAt: Date;
  slug: string;
  description: string;
}) {
  return (
    <Link href={'/articles/' + slug} className='group block'>
      <div className='grid grid-cols-3 sm:grid-cols-4 group group-hover:bg-primary/20 rounded-full py-6'>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>(News)</div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>{formatDate(publishedAt)}</div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          {readingDuration(description)}
        </div>
        <div className='col-span-3 sm:col-start-2 row-start-2 mt-4'>
          <Title size='four' className='group-hover:underline'>
            {title}
          </Title>
          <div className='text-sm mt-2 text-justify line-clamp-2 group-hover:blur-sm'>{description}</div>
        </div>
      </div>
    </Link>
  );
}

interface LatestWidgetProps {
  articles: Article[];
  projects?: '';
  messages?: '';
}

export default function LatestWidget({ articles }: LatestWidgetProps) {
  return (
    <>
      <section className='py-24 rounded-tl-[5rem] rounded-tr-[5rem] border-t-solid border-t-4 border-primary/30'>
        <Container>
          <button className='underline text-primary'>articles</button>/ <button>projects</button>
          <div className='grid grid-cols-6 gap-0 mb-4'>
            <div className='col-span-5'>
              <Title size='two' renderAs='h2' margin={false}>
                Latest entries from publications
              </Title>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {articles.map((article, index) => (
              <LatestCard
                key={index as Key}
                title={article.title}
                publishedAt={article.publishedAt}
                slug={article.slug}
                description={article.description}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
