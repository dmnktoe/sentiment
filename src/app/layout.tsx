import React from 'react';

import '../styles/globals.css';

import { CircularStd } from '@/lib/fonts';

import { ThemeProvider } from '@/components/helpers/ThemeProvider';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import NewsletterCTA from '@/components/layout/NewsletterCTA';
import VisualGrid from '@/components/layout/VisualGrid';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={CircularStd.className} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <NewsletterCTA />
          <Footer />
          <VisualGrid />
        </ThemeProvider>
      </body>
    </html>
  );
}
