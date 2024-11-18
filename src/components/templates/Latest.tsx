import { JSX, Key } from 'react';

import { Container } from '@/components/layout/Container';

function LatestCard({
  title,
  publishedAt,
  slug,
  description,
}: {
  title: string;
  publishedAt: string;
  slug: string;
  description: string;
}) {
  return (
    <a href={'/articles/' + slug} className={`group block`}>
      <div className='grid grid-cols-3 sm:grid-cols-4 group group-hover:bg-primary/20 rounded-full py-6'>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>(News)</div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          {new Date(publishedAt).toLocaleDateString()}
        </div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>Reading time: 4min</div>
        <div className='col-span-3 sm:col-start-2 row-start-2 mt-4'>
          <span className='font-secondary text-3xl sm:text-5xl group-hover:underline tracking-tight'>{title}</span>
          <div className='text-sm mt-2 text-justify line-clamp-2 group-hover:blur-sm'>{description}</div>
        </div>
      </div>
    </a>
  );
}

export default function Latest({ news }: { news: any }) {
  return (
    <>
      <section className='py-24 rounded-tl-[5rem] rounded-tr-[5rem] border-t-solid border-t-4 border-primary/30'>
        <Container>
          <div className='grid grid-cols-6 gap-0 mb-12'>
            <div className='col-span-5'>
              <h1 className='text-4xl leading-none tracking-tighter underline'>Latest entries from publications</h1>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {news.map(
              (
                item: JSX.IntrinsicAttributes & {
                  title: string;
                  publishedAt: string;
                  slug: string;
                  description: string;
                },
                index: Key | null | undefined
              ) => (
                <LatestCard key={index} {...item} />
              )
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
