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
      <div className='grid grid-cols-3 sm:grid-cols-4 group group-hover:bg-primary/20 rounded-full py-6'>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          (Project)
        </div>
        <div className='text-sm text-primary group-hover:text-black group-hover:blur-sm'>
          {formatDate(createdAt)}
        </div>
        <div className='col-span-3 sm:col-start-2 row-start-2 mt-4'>
          <Title size='four' className='group-hover:underline'>
            {title}
          </Title>
          <div className='text-sm mt-2 text-justify line-clamp-2 group-hover:blur-sm'>
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
}
