import Link from 'next/link';

import { Title } from '@/components/ui/typography/Title';
import { formatDate } from '@/lib/format-date';

export default function ProjectCard({
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
      <div className='group grid grid-cols-3 rounded-full py-6 group-hover:bg-primary/20 sm:grid-cols-4'>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          (Project)
        </div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          {formatDate(createdAt)}
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
