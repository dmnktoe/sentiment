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
          <a
            href='#main-content'
            className='sr-only z-50 rounded-md bg-primary px-4 py-2 text-black focus:not-sr-only focus:absolute focus:left-4 focus:top-4'
          >
            Skip to main content
          </a>
          <Header />
          <main id='main-content'>{children}</main>
          <NewsletterCTA />
          <Footer />
          <VisualGrid />
        </ThemeProvider>
      </body>
    </html>
  );
}
