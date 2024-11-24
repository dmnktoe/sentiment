'use client';

import Link from 'next/link';
import { Key, useState } from 'react';

import { Container } from '@/components/layout/Container';
import ArticleCard from '@/components/templates/ArticleCard';
import ProjectCard from '@/components/templates/ProjectCard';
import { Title } from '@/components/ui/typography/Title';
import clsxm from '@/lib/clsxm';
import { Article } from '@/types/Article';
import { Project } from '@/types/Project';

interface LatestWidgetProps {
  articles: Article[];
  projects: Project[];
}

export default function LatestWidget({
  articles,
  projects,
}: LatestWidgetProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'projects'>(
    'articles'
  );

  return (
    <>
      <section className='border-t-solid rounded-tl-[5rem] rounded-tr-[5rem] border-t-4 border-primary/30 py-24'>
        <Container>
          <div className='text-md mb-4 flex flex-row gap-0'>
            <button
              className={clsxm(
                activeTab === 'articles' && 'bg-primary/20 underline',
                'rounded-full px-4 py-1 hover:bg-grid'
              )}
              onClick={() => setActiveTab('articles')}
            >
              ({articles.length}) articles
            </button>
            <button
              className={clsxm(
                activeTab === 'projects' &&
                  'rounded-full bg-primary/20 underline',
                'rounded-full px-4 py-1 hover:bg-grid'
              )}
              onClick={() => setActiveTab('projects')}
            >
              ({projects.length}) projects
            </button>
          </div>
          <div className='mb-4 grid grid-cols-6 gap-0'>
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
          <div className='mt-8 flex justify-start'>
            <Link href={`/${activeTab}`} className='text-xl hover:underline'>
              View{' '}
              <span className='font-secondary italic text-primary'> all</span>{' '}
              {activeTab} <span className='font-secondary italic'>»</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
