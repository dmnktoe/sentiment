'use client';

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

import { Title } from '@/components/ui/typography/Title';

import type { BlocksContent } from '@strapi/blocks-react-renderer';

export default function BlockRendererClient({ content }: { readonly content: BlocksContent }) {
  if (!content) return null;
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          console.log(image);
          return <Image src={image.url} width={image.width} height={image.height} alt={image.alternativeText || ''} />;
        },
        heading: ({ children, level }) => {
          switch (level) {
            case 1:
              return (
                <Title renderAs='h2' size='two'>
                  {children}
                </Title>
              );
            case 2:
              return (
                <Title renderAs='h3' size='three'>
                  {children}
                </Title>
              );
            case 3:
              return (
                <Title renderAs='h4' size='four'>
                  {children}
                </Title>
              );
          }
        },
        paragraph: ({ children }) => <p className='font-secondary'>{children}</p>,
      }}
    />
  );
}