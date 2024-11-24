import { Image } from '@/types/Image';

export interface Homepage {
  id: string;
  documentId: string;
  heroTypewriter: string;
  heroFirstText: string;
  heroSecondText: string;
  heroYear: 'string';
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  heroCoverImage: Image;
  heroTinyImage: Image;
}
