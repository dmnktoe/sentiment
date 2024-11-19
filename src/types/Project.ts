import { Image } from '@/types/Image';

export interface Project {
  title: string;
  description: string;
  publishedAt: Date;
  image: Image;
}
