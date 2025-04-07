import { Image } from '@/types/Image';

export interface Homepage {
  id: string;
  documentId: string;
  heroText: string;
  heroCoverImage: Image;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}
