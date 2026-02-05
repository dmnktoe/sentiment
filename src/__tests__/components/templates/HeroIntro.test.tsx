import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes, ReactNode } from 'react';

import HeroIntro from '@/components/templates/HeroIntro';

import { Homepage } from '@/types/Homepage';

// Define empty image formats for testing
const emptyImageFormats = {
  large: {
    ext: '',
    url: '',
    hash: '',
    mime: '',
    name: '',
    path: null,
    size: 0,
    width: 0,
    height: 0,
  },
  small: {
    ext: '',
    url: '',
    hash: '',
    mime: '',
    name: '',
    path: null,
    size: 0,
    width: 0,
    height: 0,
  },
  medium: {
    ext: '',
    url: '',
    hash: '',
    mime: '',
    name: '',
    path: null,
    size: 0,
    width: 0,
    height: 0,
  },
  thumbnail: {
    ext: '',
    url: '',
    hash: '',
    mime: '',
    name: '',
    path: null,
    size: 0,
    width: 0,
    height: 0,
  },
};

// Mock Next.js components
type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  priority?: boolean;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    priority: _priority,
    blurDataURL: _blurDataURL,
    placeholder: _placeholder,
    ...props
  }: MockImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

type MockLinkProps = {
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
};

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, target, rel }: MockLinkProps) => (
    <a href={href} target={target} rel={rel}>
      {children}
    </a>
  ),
}));

// Mock strapi-urls
jest.mock('@/lib/strapi-urls', () => ({
  getStrapiMedia: (url: string) => url,
}));

describe('HeroIntro', () => {
  const mockContent: Homepage = {
    id: '1',
    documentId: 'doc_1',
    heroText: 'This is a test hero text about sentiment analysis.',
    heroCoverImage: {
      name: 'test-image.jpg',
      alternativeText: 'Test Image',
      url: '/test-image.jpg',
      width: 1000,
      height: 600,
      caption: null,
      formats: emptyImageFormats,
      hash: 'test_hash',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 12345,
      previewUrl: null,
      provider: 'local',
      provider_metadata: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    publishedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  describe('Text Section', () => {
    it('should render the prominent text with correct styling', () => {
      render(<HeroIntro content={mockContent} />);

      expect(screen.getByText(/Creating/i)).toBeInTheDocument();
      expect(screen.getByText(/Safe/i)).toBeInTheDocument();
      expect(screen.getByText(/Supportive/i)).toBeInTheDocument();
    });

    it('should render hero text from content', () => {
      render(<HeroIntro content={mockContent} />);

      expect(
        screen.getByText('This is a test hero text about sentiment analysis.'),
      ).toBeInTheDocument();
    });

    it('should render More button with correct link', () => {
      render(<HeroIntro content={mockContent} />);

      const moreButton = screen.getByRole('link', { name: /more/i });
      expect(moreButton).toBeInTheDocument();
      expect(moreButton).toHaveAttribute('href', '/about');
    });

    it('should render hero image with correct attributes', () => {
      render(<HeroIntro content={mockContent} />);

      const image = screen.getByAltText(
        /Sentiment explores the delicate intersection/i,
      );
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('width', '1000');
      expect(image).toHaveAttribute('height', '600');
    });
  });

  describe('Partners Section', () => {
    it('should render all 4 partner links', () => {
      render(<HeroIntro content={mockContent} />);

      const partnerLinks = screen.getAllByRole('link').filter((link) => {
        const href = link.getAttribute('href');
        return (
          href?.includes('bmbf.de') ||
          href?.includes('ruhr-uni-bochum.de') ||
          href?.includes('uni-due.de') ||
          href?.includes('uni-kassel.de')
        );
      });

      expect(partnerLinks).toHaveLength(4);
    });

    it('should render BMBF partner with correct link', () => {
      render(<HeroIntro content={mockContent} />);

      const bmbfLink = screen
        .getAllByRole('link')
        .find((link) => link.getAttribute('href') === 'https://www.bmbf.de/');
      expect(bmbfLink).toBeInTheDocument();
    });

    it('should render RUB partner with correct link', () => {
      render(<HeroIntro content={mockContent} />);

      const rubLink = screen
        .getAllByRole('link')
        .find(
          (link) =>
            link.getAttribute('href') === 'https://www.ruhr-uni-bochum.de/',
        );
      expect(rubLink).toBeInTheDocument();
    });

    it('should render UniDUE partner with correct link', () => {
      render(<HeroIntro content={mockContent} />);

      const uniDueLink = screen
        .getAllByRole('link')
        .find(
          (link) => link.getAttribute('href') === 'https://www.uni-due.de/',
        );
      expect(uniDueLink).toBeInTheDocument();
    });

    it('should render UniKassel partner with correct link', () => {
      render(<HeroIntro content={mockContent} />);

      const uniKasselLink = screen
        .getAllByRole('link')
        .find(
          (link) => link.getAttribute('href') === 'https://www.uni-kassel.de/',
        );
      expect(uniKasselLink).toBeInTheDocument();
    });

    it('should render partners in a grid layout', () => {
      const { container } = render(<HeroIntro content={mockContent} />);

      const grid = container.querySelector('.grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Section Structure', () => {
    it('should render section with correct styling classes', () => {
      const { container } = render(<HeroIntro content={mockContent} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('pb-24', 'pt-24', 'sm:pt-36');
    });

    it('should render Container component', () => {
      const { container } = render(<HeroIntro content={mockContent} />);

      // Container has mx-auto class
      const containerDiv = container.querySelector('.mx-auto');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should render with border styling', () => {
      const { container } = render(<HeroIntro content={mockContent} />);

      const borderDiv = container.querySelector('.border-b-solid');
      expect(borderDiv).toBeInTheDocument();
      expect(borderDiv).toHaveClass('border-b-[1px]', 'border-b-grid');
    });
  });

  describe('Layout and Responsive Design', () => {
    it('should render text in grid layout', () => {
      const { container } = render(<HeroIntro content={mockContent} />);

      const textGrid = container.querySelector('.grid-cols-3');
      expect(textGrid).toBeInTheDocument();
    });

    it('should apply responsive styling to partners grid', () => {
      const { container } = render(<HeroIntro content={mockContent} />);

      const partnersGrid = container.querySelector('.sm\\:grid-cols-4');
      expect(partnersGrid).toBeInTheDocument();
    });
  });
});
