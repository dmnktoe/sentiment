import { Metadata } from 'next';

import './globals.css';

import { Inter } from 'next/font/google';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import VisualGrid from '@/components/layout/VisualGrid';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `SENTIMENT - IT Security Protects Privacy and Supports Democracy`,
  description: `Funding guideline "Platform Privacy - IT Security Protects Privacy and Supports Democracy" as part of the German government's research framework program on IT security "Digital. Secure. Sovereign"`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='font-primary text-dark'>
        <Header />
        {children}
        <Footer />
        <VisualGrid />
      </body>
    </html>
  );
}
