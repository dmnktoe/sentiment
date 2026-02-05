import type { BlocksContent } from '@strapi/blocks-react-renderer';
import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes, ReactNode } from 'react';

import BlockRendererClient from '@/components/helpers/BlockRendererClient';

// Mock Next.js Image
type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Link component
type MockLinkProps = {
  children: ReactNode;
  href: string;
  external?: boolean;
  variant?: string;
};

jest.mock('@/components/ui/Link', () => ({
  Link: ({ children, href, external, variant }: MockLinkProps) => (
    <a href={href} target={external ? '_blank' : undefined} className={variant}>
      {children}
    </a>
  ),
}));

describe('BlockRendererClient', () => {
  describe('Null/Empty Content', () => {
    it('should return null when content is null', () => {
      const { container } = render(
        <BlockRendererClient content={null as unknown as BlocksContent} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when content is undefined', () => {
      const { container } = render(
        <BlockRendererClient content={undefined as unknown as BlocksContent} />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Image Block', () => {
    it('should render image with correct attributes', () => {
      const content: BlocksContent = [
        {
          type: 'image',
          image: {
            name: 'test.jpg',
            alternativeText: 'Test Image',
            url: '/uploads/test.jpg',
            width: 800,
            height: 600,
          },
        },
      ];

      render(<BlockRendererClient content={content} />);

      const image = screen.getByAltText('Test Image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/uploads/test.jpg');
      expect(image).toHaveAttribute('width', '800');
      expect(image).toHaveAttribute('height', '600');
    });

    it('should render image without alternative text', () => {
      const content: BlocksContent = [
        {
          type: 'image',
          image: {
            name: 'test.jpg',
            url: '/uploads/test.jpg',
            width: 800,
            height: 600,
          },
        },
      ];

      render(<BlockRendererClient content={content} />);

      const image = screen.getByAltText('');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', '');
    });
  });

  describe('Heading Blocks', () => {
    it('should render h1 heading as h3 Title component', () => {
      const content: BlocksContent = [
        {
          type: 'heading',
          level: 1,
          children: [{ type: 'text', text: 'Heading Level 1' }],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Heading Level 1');
    });

    it('should render h2 heading as h4 Title component', () => {
      const content: BlocksContent = [
        {
          type: 'heading',
          level: 2,
          children: [{ type: 'text', text: 'Heading Level 2' }],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Heading Level 2');
    });

    it('should render h3 heading as h5 Title component', () => {
      const content: BlocksContent = [
        {
          type: 'heading',
          level: 3,
          children: [{ type: 'text', text: 'Heading Level 3' }],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Heading Level 3');
    });
  });

  describe('Paragraph Block', () => {
    it('should render paragraph with text', () => {
      const content: BlocksContent = [
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: 'This is a test paragraph with content.' },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      expect(
        screen.getByText('This is a test paragraph with content.'),
      ).toBeInTheDocument();
    });

    it('should apply font-primary class to paragraph', () => {
      const content: BlocksContent = [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Test paragraph' }],
        },
      ];

      const { container } = render(<BlockRendererClient content={content} />);

      const paragraph = container.querySelector('.font-primary');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent('Test paragraph');
    });
  });

  describe('Link Block', () => {
    it('should render external link with correct attributes', () => {
      const content: BlocksContent = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ type: 'text', text: 'External Link' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const link = screen.getByRole('link', { name: 'External Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should render internal link without target blank', () => {
      const content: BlocksContent = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: '/internal-page',
              children: [{ type: 'text', text: 'Internal Link' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const link = screen.getByRole('link', { name: 'Internal Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/internal-page');
      expect(link).not.toHaveAttribute('target');
    });

    it('should apply underline variant to links', () => {
      const content: BlocksContent = [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: '/test',
              children: [{ type: 'text', text: 'Test Link' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const link = screen.getByRole('link', { name: 'Test Link' });
      expect(link).toHaveClass('underline');
    });
  });

  describe('List Blocks', () => {
    it('should render ordered list', () => {
      const content: BlocksContent = [
        {
          type: 'list',
          format: 'ordered',
          children: [
            {
              type: 'list-item',
              children: [{ type: 'text', text: 'First item' }],
            },
            {
              type: 'list-item',
              children: [{ type: 'text', text: 'Second item' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should render unordered list', () => {
      const content: BlocksContent = [
        {
          type: 'list',
          format: 'unordered',
          children: [
            {
              type: 'list-item',
              children: [{ type: 'text', text: 'Bullet one' }],
            },
            {
              type: 'list-item',
              children: [{ type: 'text', text: 'Bullet two' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      expect(screen.getByText('Bullet one')).toBeInTheDocument();
      expect(screen.getByText('Bullet two')).toBeInTheDocument();
    });

    it('should render list items correctly', () => {
      const content: BlocksContent = [
        {
          type: 'list',
          format: 'unordered',
          children: [
            {
              type: 'list-item',
              children: [{ type: 'text', text: 'Item content' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(listItems[0]).toHaveTextContent('Item content');
    });
  });

  describe('Mixed Content', () => {
    it('should render multiple block types together', () => {
      const content: BlocksContent = [
        {
          type: 'heading',
          level: 1,
          children: [{ type: 'text', text: 'Article Title' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'This is a paragraph.' }],
        },
        {
          type: 'list',
          format: 'unordered',
          children: [
            {
              type: 'list-item',
              children: [{ type: 'text', text: 'List item' }],
            },
          ],
        },
      ];

      render(<BlockRendererClient content={content} />);

      expect(screen.getByText('Article Title')).toBeInTheDocument();
      expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
      expect(screen.getByText('List item')).toBeInTheDocument();
    });
  });
});
