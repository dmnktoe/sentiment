import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import LatestWidget from '@/components/templates/LatestWidget';

import { Article } from '@/types/Article';

// Mock ArticleCard
type MockArticleCardProps = {
  title: ReactNode;
  slug: string;
};

jest.mock('@/components/templates/ArticleCard', () => ({
  __esModule: true,
  default: ({ title, slug }: MockArticleCardProps) => (
    <div data-testid='article-card'>
      <a href={`/articles/${slug}`}>{title}</a>
    </div>
  ),
}));

describe('LatestWidget', () => {
  const mockArticles: Article[] = [
    {
      id: 1,
      slug: 'article-one',
      title: 'First Article',
      description: 'Description for first article',
      content: [],
      createdAt: '2024-01-15T10:00:00.000Z',
      author: 'Author One',
      tags: 'Technology',
    },
    {
      id: 2,
      slug: 'article-two',
      title: 'Second Article',
      description: 'Description for second article',
      content: [],
      createdAt: '2024-01-16T10:00:00.000Z',
      author: 'Author Two',
      tags: 'Science',
    },
    {
      id: 3,
      slug: 'article-three',
      title: 'Third Article',
      description: 'Description for third article',
      content: [],
      createdAt: '2024-01-17T10:00:00.000Z',
      author: 'Author Three',
      tags: 'AI',
    },
  ];

  describe('Section Structure', () => {
    it('should render section with correct styling', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('py-24');
      expect(section).toHaveClass('border-t-4');
      expect(section).toHaveClass('border-primary/30');
    });

    it('should render section with rounded corners', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('rounded-tl-[5rem]');
      expect(section).toHaveClass('rounded-tr-[5rem]');
    });

    it('should render Container component', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const containerDiv = container.querySelector('.mx-auto');
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('Title Section', () => {
    it('should render title with article count', () => {
      render(<LatestWidget articles={mockArticles} />);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Recent Articles (3)');
    });

    it('should display correct count for different article lengths', () => {
      render(<LatestWidget articles={[mockArticles[0]]} />);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Recent Articles (1)');
    });

    it('should display zero articles correctly', () => {
      render(<LatestWidget articles={[]} />);

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Recent Articles (0)');
    });
  });

  describe('Articles Rendering', () => {
    it('should render all articles', () => {
      render(<LatestWidget articles={mockArticles} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(3);
    });

    it('should render article titles', () => {
      render(<LatestWidget articles={mockArticles} />);

      expect(screen.getByText('First Article')).toBeInTheDocument();
      expect(screen.getByText('Second Article')).toBeInTheDocument();
      expect(screen.getByText('Third Article')).toBeInTheDocument();
    });

    it('should render articles with correct slugs', () => {
      render(<LatestWidget articles={mockArticles} />);

      const firstLink = screen.getByRole('link', { name: 'First Article' });
      expect(firstLink).toHaveAttribute('href', '/articles/article-one');

      const secondLink = screen.getByRole('link', { name: 'Second Article' });
      expect(secondLink).toHaveAttribute('href', '/articles/article-two');
    });

    it('should handle empty articles array', () => {
      render(<LatestWidget articles={[]} />);

      const articleCards = screen.queryAllByTestId('article-card');
      expect(articleCards).toHaveLength(0);
    });
  });

  describe('Layout', () => {
    it('should render articles in flex column layout', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const flexContainer = container.querySelector('.flex-col');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass('gap-4');
    });

    it('should render title in grid layout with correct span', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const gridContainer = container.querySelector('.grid-cols-6');
      expect(gridContainer).toBeInTheDocument();

      const titleContainer = container.querySelector('.col-span-5');
      expect(titleContainer).toBeInTheDocument();
    });
  });

  describe('"View All" Link', () => {
    it('should render view all articles link', () => {
      render(<LatestWidget articles={mockArticles} />);

      const viewAllLink = screen.getByRole('link', { name: /View.*all/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute('href', '/articles');
    });

    it('should render link with correct styling', () => {
      render(<LatestWidget articles={mockArticles} />);

      const viewAllLink = screen.getByRole('link', { name: /View.*all/i });
      expect(viewAllLink).toHaveClass('text-xl');
      expect(viewAllLink).toHaveClass('hover:underline');
    });

    it('should render link inside flex container', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const flexContainer = container.querySelector('.mt-8.flex.justify-start');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive padding', () => {
      const { container } = render(<LatestWidget articles={mockArticles} />);

      const paddingDiv = container.querySelector('.px-2');
      expect(paddingDiv).toHaveClass('sm:px-4');
    });
  });

  describe('Props Handling', () => {
    it('should handle single article', () => {
      render(<LatestWidget articles={[mockArticles[0]]} />);

      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(1);
      expect(screen.getByText('First Article')).toBeInTheDocument();
    });

    it('should render with many articles', () => {
      const manyArticles = [
        ...mockArticles,
        {
          id: 4,
          slug: 'article-four',
          title: 'Fourth Article',
          description: 'Description',
          content: [],
          createdAt: '2024-01-18T10:00:00.000Z',
          author: 'Author Four',
          tags: 'Test',
        },
        {
          id: 5,
          slug: 'article-five',
          title: 'Fifth Article',
          description: 'Description',
          content: [],
          createdAt: '2024-01-19T10:00:00.000Z',
          author: 'Author Five',
          tags: 'Test',
        },
      ];

      render(<LatestWidget articles={manyArticles} />);

      expect(screen.getByText('Recent Articles (5)')).toBeInTheDocument();
      const articleCards = screen.getAllByTestId('article-card');
      expect(articleCards).toHaveLength(5);
    });
  });
});
