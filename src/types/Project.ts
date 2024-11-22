import { BlocksContent } from '@strapi/blocks-react-renderer';

import { Image } from '@/types/Image';

export interface Project {
  title: string;
  slug: string;
  description: string;
  publishedAt: Date;
  createdAt: Date;
  image: Image;
  content: BlocksContent;
}
