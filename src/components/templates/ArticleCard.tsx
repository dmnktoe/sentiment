import Link from 'next/link';

import { formatDate } from '@/lib/format-date';
import { readingDuration } from '@/lib/get-reading-time';

import { Title } from '@/components/ui/typography/Title';

interface ArticleCardProps {
  title: string;
  createdAt: Date;
  slug: string;
  description: string;
  imageUrl?: string;
  prominent?: boolean;
  tags?: string;
  author?: string;
}

export default function ArticleCard({
  title,
  createdAt,
  slug,
  description,
  imageUrl,
  prominent = false,
  author,
}: ArticleCardProps) {
  if (prominent && imageUrl) {
    return (
      <Link href={'/articles/' + slug} className='group block'>
        <div className='group grid grid-cols-3 rounded-full py-6 group-hover:bg-primary/20 sm:grid-cols-4'>
          <div className='relative col-span-1'>
            <div className='text-sm text-primary group-hover:text-text group-hover:blur-sm'>
              {formatDate(createdAt)}
            </div>
            <div className='text-sm text-primary group-hover:text-text group-hover:blur-sm'>
              {author}
            </div>
          </div>
          <div className='col-span-2 sm:col-span-3 sm:mt-0'>
            <Title size='four' className='font-primary group-hover:underline'>
              {title}
            </Title>
            <div className='mt-2 line-clamp-5 text-sm'>{description}</div>
            <div className='mt-4 text-sm text-primary group-hover:text-text group-hover:underline'>
              {readingDuration(description)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={'/articles/' + slug} className='group block'>
      <div className='group grid grid-cols-3 rounded-full py-6 group-hover:bg-primary/20 sm:grid-cols-4'>
        <div className='text-sm text-primary group-hover:text-text group-hover:blur-sm'>
          {author}
        </div>
        <div className='text-sm text-primary group-hover:text-text group-hover:blur-sm'>
          {formatDate(createdAt)}
        </div>
        <div className='text-sm text-primary group-hover:text-text group-hover:blur-sm'>
          {readingDuration(description)}
        </div>
        <div className='col-span-3 row-start-2 mt-4 sm:col-start-2'>
          <Title size='four' className='font-primary group-hover:underline'>
            {title}
          </Title>
          <div className='mt-2 line-clamp-2 text-sm group-hover:blur-sm'>
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}
