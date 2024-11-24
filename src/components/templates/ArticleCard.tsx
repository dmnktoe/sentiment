import Image from 'next/image';
import Link from 'next/link';

import { Title } from '@/components/ui/typography/Title';
import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';
import { getStrapiMedia } from '@/lib/strapi-urls';

interface ArticleCardProps {
  title: string;
  publishedAt: Date;
  slug: string;
  description: string;
  imageUrl?: string;
  prominent?: boolean;
}

export default function ArticleCard({
  title,
  publishedAt,
  slug,
  description,
  imageUrl,
  prominent = false,
}: ArticleCardProps) {
  if (prominent && imageUrl) {
    return (
      <Link href={'/articles/' + slug} className='group block'>
        <div className='group grid grid-cols-3 rounded-full py-6 group-hover:bg-primary/20 sm:grid-cols-8'>
          <div className='relative col-span-2 h-[125px]'>
            <Image
              src={getStrapiMedia(imageUrl)}
              alt={title}
              layout='fill'
              objectFit='cover'
              className='grayscale group-hover:grayscale-0'
            />
          </div>
          <div className='col-span-3 mt-4 sm:col-span-6 sm:col-start-4 sm:mt-0'>
            <div className='mb-4 text-sm text-primary group-hover:text-black group-hover:blur-sm'>
              {formatDate(publishedAt)}
            </div>
            <Title size='three' className='group-hover:underline'>
              {title}
            </Title>
            <div className='mt-2 line-clamp-5 text-justify text-sm'>
              {description}
            </div>
            <div className='mt-4 text-sm text-primary group-hover:text-black group-hover:underline'>
              Read more <span className='font-secondary'>&rarr;</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={'/articles/' + slug} className='group block'>
      <div className='group grid grid-cols-3 rounded-full py-6 group-hover:bg-primary/20 sm:grid-cols-4'>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          (News)
        </div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          {formatDate(publishedAt)}
        </div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          {readingDuration(description)}
        </div>
        <div className='col-span-3 row-start-2 mt-4 sm:col-start-2'>
          <Title size='four' className='group-hover:underline'>
            {title}
          </Title>
          <div className='mt-2 line-clamp-2 text-justify text-sm group-hover:blur-sm'>
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}
