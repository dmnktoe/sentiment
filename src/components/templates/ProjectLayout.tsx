'use client';

import Image from 'next/image';

import BlockRendererClient from '@/components/helpers/BlockRendererClient';
import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import { Title } from '@/components/ui/typography/Title';
import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { getStrapiMedia } from '@/lib/strapi-urls';
import { Project } from '@/types/Project';

interface ProjectProps {
  project: Project;
}

function ProjectSidebar() {
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

function ProjectInfo({ project }: ProjectProps) {
  return (
    <>
      <div className='text-sm text-primary'>(News)</div>
      <div className='text-sm text-primary'>{formatDate(project.publishedAt)}</div>
      <div className='text-sm text-primary'>{readingDuration(project.description)}</div>
    </>
  );
}

function ProjectHeader({ project }: ProjectProps) {
  return (
    <>
      {project?.image?.url && (
        <div className='col-span-3'>
          <div className='w-full'>
            <Image
              src={getStrapiMedia(project.image.url ?? '')}
              blurDataURL={getStrapiMedia(project.image.url ?? '')}
              placeholder='blur'
              alt={project.title}
              width={1600}
              height={600}
              className='block w-full h-[300px] object-cover'
            />
          </div>
        </div>
      )}
      <div className='col-span-4 flex flex-col gap-4'>
        <Title renderAs='h1' size='two' margin={false}>
          {project.title}
        </Title>
      </div>
      <div className='col-span-3 sm:col-span-2'>
        <div className='text-primary text-sm mb-4'>Written by Dr. Jessica Szczuka</div>
        <div className='prose text-tertiary text-justify text-sm'>{project.description}</div>
      </div>
    </>
  );
}

export default function ProjectLayout({ project }: ProjectProps) {
  return (
    <>
      <section className='py-36'>
        <Container>
          <Crossbar />
          {/* Project Info Grid */}
          <div className='grid grid-cols-3 sm:grid-cols-4 mb-6'>
            <ProjectInfo project={project} />
          </div>
          {/* Project Content Grid */}
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-0 gap-y-6'>
            <ProjectHeader project={project} />
            <ProjectSidebar />
            <div className='col-span-3 sm:col-span-3'>
              <BlockRendererClient content={project.content} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
