import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.project-sentiment.org',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/events',
        destination: 'https://sentiment-exhibition.vercel.app/api/events/',
      },
      {
        source: '/api/events/',
        destination: 'https://sentiment-exhibition.vercel.app/api/events/',
      },
      {
        source: '/api/events/:path*',
        destination:
          'https://sentiment-exhibition.vercel.app/api/events/:path*',
      },
      {
        source: '/public/:path*',
        destination: 'https://sentiment-exhibition.vercel.app/public/:path*',
      },
      {
        source: '/exhibition',
        destination: 'https://sentiment-exhibition.vercel.app/',
      },
      {
        source: '/exhibition/',
        destination: 'https://sentiment-exhibition.vercel.app/',
      },
      {
        source: '/exhibition/:path*',
        destination: 'https://sentiment-exhibition.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
