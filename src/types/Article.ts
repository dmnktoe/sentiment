import { BlocksContent } from '@strapi/blocks-react-renderer';

import { Image } from '@/types/Image';

export interface Article {
  title: string;
  slug: string;
  description: string;
  content: BlocksContent;
  createdAt: Date;
  image: Image;
  author: string;
  tags: string;
}
