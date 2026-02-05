import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';

import ArticleLayout from '@/components/templates/ArticleLayout';

import { Article } from '@/types/Article';

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

// Mock strapi-urls
jest.mock('@/lib/strapi-urls', () => ({
  getStrapiMedia: (url: string) => url,
}));

// Mock BlockRendererClient
jest.mock('@/components/helpers/BlockRendererClient', () => ({
  __esModule: true,
  default: ({ content }: { content: unknown }) => (
    <div data-testid='block-renderer'>{JSON.stringify(content)}</div>
  ),
}));

// Mock formatDate
jest.mock('@/lib/format-date', () => ({
  formatDate: (_date: string) => 'January 15, 2024',
}));

// Mock readingDuration
jest.mock('@/lib/get-reading-time', () => ({
  readingDuration: (_text: string) => '5 min read',
}));

describe('ArticleLayout', () => {
  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'This is a test article description with some content.',
    content: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Test content' }],
      },
    ],
    createdAt: new Date('2024-01-15T10:00:00.000Z'),
    author: 'John Doe',
    tags: 'Technology, Testing',
    image: {
      name: 'test-article-image.jpg',
      alternativeText: 'Test Article',
      url: '/test-article-image.jpg',
      width: 1600,
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
  };

  describe('Article Header', () => {
    it('should render article title as h1', () => {
      render(<ArticleLayout article={mockArticle} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Test Article Title');
    });

    it('should render article author', () => {
      render(<ArticleLayout article={mockArticle} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render formatted date', () => {
      render(<ArticleLayout article={mockArticle} />);

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('should render reading duration', () => {
      render(<ArticleLayout article={mockArticle} />);

      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('should render article tags in category section', () => {
      render(<ArticleLayout article={mockArticle} />);

      expect(screen.getByText(/Category/i)).toBeInTheDocument();
      expect(screen.getByText('Technology, Testing')).toBeInTheDocument();
    });

    it('should render keywords section', () => {
      render(<ArticleLayout article={mockArticle} />);

      expect(screen.getByText(/Keywords:/i)).toBeInTheDocument();
      expect(screen.getByText('Technology, Testing')).toBeInTheDocument();
    });
  });

  describe('Article Description', () => {
    it('should render article description in prose container', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const proseDiv = container.querySelector('.prose');
      expect(proseDiv).toBeInTheDocument();
      expect(proseDiv).toHaveTextContent(
        'This is a test article description with some content.',
      );
    });
  });

  describe('Article Image', () => {
    it('should render article image when provided', () => {
      render(<ArticleLayout article={mockArticle} />);

      const image = screen.getByAltText('Test Article Title');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-article-image.jpg');
      expect(image).toHaveAttribute('width', '1600');
      expect(image).toHaveAttribute('height', '600');
    });

    it('should render article with image', () => {
      render(<ArticleLayout article={mockArticle} />);

      const images = screen.queryAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should apply correct styling to image', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const image = container.querySelector('img');
      expect(image).toHaveClass('h-[300px]', 'w-full', 'object-cover');
    });
  });

  describe('Article Content', () => {
    it('should render BlockRendererClient with article content', () => {
      render(<ArticleLayout article={mockArticle} />);

      const blockRenderer = screen.getByTestId('block-renderer');
      expect(blockRenderer).toBeInTheDocument();
    });

    it('should pass content to BlockRendererClient', () => {
      render(<ArticleLayout article={mockArticle} />);

      const blockRenderer = screen.getByTestId('block-renderer');
      expect(blockRenderer).toHaveTextContent('paragraph');
      expect(blockRenderer).toHaveTextContent('Test content');
    });
  });

  describe('Layout Structure', () => {
    it('should render section with correct styling', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-24', 'sm:py-36');
    });

    it('should render with grid layout', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const grid = container.querySelector('.grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('should render Container component', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const containerDiv = container.querySelector('.mx-auto');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should use responsive grid columns', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const responsiveGrid = container.querySelector('.sm\\:grid-cols-4');
      expect(responsiveGrid).toBeInTheDocument();
    });
  });

  describe('Grid Column Spanning', () => {
    it('should render title with correct column span', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const titleContainer = container.querySelector('.col-span-4');
      expect(titleContainer).toBeInTheDocument();
    });

    it('should render content with correct column span', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const contentContainer = container.querySelector('.sm\\:col-span-3');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Article Metadata', () => {
    it('should render all metadata in a grid', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const metadataGrids = container.querySelectorAll('.grid-cols-3');
      expect(metadataGrids.length).toBeGreaterThan(0);
    });

    it('should style metadata text correctly', () => {
      const { container } = render(<ArticleLayout article={mockArticle} />);

      const metadataTexts = container.querySelectorAll('.text-primary');
      expect(metadataTexts.length).toBeGreaterThan(0);
    });
  });
});
