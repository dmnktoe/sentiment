import { Metadata } from 'next';

import About from '@/components/templates/About';

export const metadata: Metadata = {
  title: `About » Project Sentiment (dot) org, Support Democracy`,
  description: `Part of the German government's research framework program on IT security "Digital. Secure. Sovereign".`,
};

export default function AboutPage() {
  return <About />;
}
