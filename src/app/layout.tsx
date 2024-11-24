import '../styles/globals.css';

import React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import VisualGrid from '@/components/layout/VisualGrid';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        <Header />
        <main>{children}</main>
        <Footer />
        <VisualGrid />
      </body>
    </html>
  );
}
