import { Metadata } from 'next';

import '../styles/globals.css';

import React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import VisualGrid from '@/components/layout/VisualGrid';

export const metadata: Metadata = {
  title: `SENTIMENT - IT Security Protects Privacy and Supports Democracy`,
  description: `Part of the German government's research framework program on IT security "Digital. Secure. Sovereign".`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <VisualGrid />
      </body>
    </html>
  );
}
