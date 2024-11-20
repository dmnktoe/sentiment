'use client';

import Link from 'next/link';
import { Key, useState } from 'react';

import { Container } from '@/components/layout/Container';
import { Title } from '@/components/ui/typography/Title';
import clsxm from '@/lib/clsxm';
import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { Article } from '@/types/Article';
import { Project } from '@/types/Project';

function ArticleCard({
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

function ProjectCard({
  title,
  createdAt,
  slug,
  description,
}: {
  title: string;
  createdAt: Date;
  slug: string;
  description: string;
}) {
  return (
    <Link href={'/projects/' + slug} className='group block'>
      <div className='grid grid-cols-3 sm:grid-cols-4 group group-hover:bg-primary/20 rounded-full py-6'>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>(Project)</div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>{formatDate(createdAt)}</div>
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
  projects: Project[];
}

export default function LatestWidget({ articles, projects }: LatestWidgetProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'projects'>('articles');

  return (
    <>
      <section className='py-24 rounded-tl-[5rem] rounded-tr-[5rem] border-t-solid border-t-4 border-primary/30'>
        <Container>
          <div className='mb-4 text-md flex flex-row gap-0'>
            <button
              className={clsxm(
                activeTab === 'articles' && 'bg-primary/20 underline',
                'py-1 px-4 rounded-full hover:bg-grid'
              )}
              onClick={() => setActiveTab('articles')}
            >
              ({articles.length}) articles
            </button>
            <button
              className={clsxm(
                activeTab === 'projects' && 'rounded-full bg-primary/20 underline',
                'py-1 px-4 rounded-full hover:bg-grid'
              )}
              onClick={() => setActiveTab('projects')}
            >
              ({projects.length}) projects
            </button>
          </div>
          <div className='grid grid-cols-6 gap-0 mb-4'>
            <div className='col-span-5'>
              <Title size='two' renderAs='h2' margin={false}>
                Latest entries from {activeTab}
              </Title>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {activeTab === 'articles' &&
              articles.map((article, index) => (
                <ArticleCard
                  key={index as Key}
                  title={article.title}
                  publishedAt={article.publishedAt}
                  slug={article.slug}
                  description={article.description}
                />
              ))}
            {activeTab === 'projects' &&
              projects.map((project, index) => (
                <ProjectCard
                  key={index as Key}
                  title={project.title}
                  createdAt={project.createdAt}
                  slug={project.slug}
                  description={project.description}
                />
              ))}
          </div>
          <div className='flex justify-start mt-8'>
            <Link href={`/${activeTab}`} className='hover:underline text-xl'>
              View <span className='text-primary font-secondary italic'> all</span> {activeTab}{' '}
              <span className='font-secondary italic'>»</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
