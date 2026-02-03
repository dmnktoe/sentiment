'use client';

import type { BlocksContent } from '@strapi/blocks-react-renderer';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

import { Link } from '@/components/ui/Link';
import { List, ListItem } from '@/components/ui/List';
import { Paragraph, Title } from '@/components/ui/typography';

export default function BlockRendererClient({
  content,
}: {
  readonly content: BlocksContent;
}) {
  if (!content) return null;
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          return (
            <Image
              src={image.url}
              width={image.width}
              height={image.height}
              alt={image.alternativeText || ''}
            />
          );
        },
        heading: ({ children, level }) => {
          switch (level) {
            case 1:
              return (
                <Title renderAs='h3' size='three'>
                  {children}
                </Title>
              );
            case 2:
              return (
                <Title renderAs='h4' size='four'>
                  {children}
                </Title>
              );
            case 3:
              return (
                <Title renderAs='h5' size='five'>
                  {children}
                </Title>
              );
          }
        },
        paragraph: ({ children }) => (
          <Paragraph className='font-primary'>{children}</Paragraph>
        ),
        link: ({ children, url }) => {
          const isExternal =
            url.startsWith('http://') || url.startsWith('https://');
          return (
            <Link href={url} external={isExternal} variant='underline'>
              {children}
            </Link>
          );
        },
        list: ({ children, format }) => {
          const ordered = format === 'ordered';
          return <List ordered={ordered}>{children}</List>;
        },
        'list-item': ({ children }) => {
          return <ListItem>{children}</ListItem>;
        },
      }}
    />
  );
}
