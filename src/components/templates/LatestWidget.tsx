import Link from 'next/link';
import { Key } from 'react';

import { Container } from '@/components/layout/Container';
import ArticleCard from '@/components/templates/ArticleCard';
import { Title } from '@/components/ui/typography/Title';

import { Article } from '@/types/Article';

interface LatestWidgetProps {
  articles: Article[];
}

export default function LatestWidget({ articles }: LatestWidgetProps) {
  return (
    <>
      <section className='border-t-solid border-primary/30 rounded-tl-[5rem] rounded-tr-[5rem] border-t-4 py-24'>
        <Container>
          <div className='px-2 sm:px-4'>
            <div className='mb-4 grid grid-cols-6 gap-0'>
              <div className='col-span-5'>
                <Title size='two' renderAs='h2' margin={false}>
                  Recent Articles ({articles.length})
                </Title>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              {articles.map((article, index) => (
                <ArticleCard
                  key={index as Key}
                  title={article.title}
                  createdAt={article.createdAt}
                  slug={article.slug}
                  description={article.description}
                  tags={article.tags}
                  author={article.author}
                />
              ))}
            </div>
            <div className='mt-8 flex justify-start'>
              <Link href='/articles' className='text-xl hover:underline'>
                View{' '}
                <span className='font-secondary text-primary italic'> all</span>{' '}
                articles <span className='font-secondary italic'>»</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
