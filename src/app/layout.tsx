import React from 'react';

import '../styles/globals.css';

import { CircularStd } from '@/lib/fonts';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import VisualGrid from '@/components/layout/VisualGrid';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={CircularStd.className}>
      <body suppressHydrationWarning={true}>
        <Header />
        <main>{children}</main>
        <Footer />
        <VisualGrid />
      </body>
    </html>
  );
}
