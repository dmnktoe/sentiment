import { Metadata } from 'next';

import CookiePolicy from '@/components/templates/CookiePolicy';

export const metadata: Metadata = {
  title: 'Cookie Policy, Project Sentiment (dot) org',
  description:
    'Cookie policy and transparent consent control center for the SENTIMENT research project. Part of the German government\'s research framework program on IT security "Digital. Secure. Sovereign".',
};

export default function CookiesPage() {
  return <CookiePolicy />;
}
