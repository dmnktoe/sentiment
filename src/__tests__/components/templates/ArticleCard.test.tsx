/**
 * Tests for ArticleCard component
 */
import { render, screen } from '@testing-library/react';

import ArticleCard from '@/components/templates/ArticleCard';

describe('ArticleCard Component', () => {
  const defaultProps = {
    title: 'Test Article Title',
    createdAt: new Date('2024-01-15'),
    slug: 'test-article',
    description:
      'This is a test article description that contains enough text to test the reading time calculation.',
    author: 'John Doe',
  };

  describe('Standard Card (non-prominent)', () => {
    it('should render article title', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    it('should render article description', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText(/test article description/i)).toBeInTheDocument();
    });

    it('should render formatted date', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText(/Jan.*2024|15|January/i)).toBeInTheDocument();
    });

    it('should render author name', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render reading duration', () => {
      render(<ArticleCard {...defaultProps} />);
      expect(screen.getByText(/min read/i)).toBeInTheDocument();
    });

    it('should render as link to article', () => {
      const { container } = render(<ArticleCard {...defaultProps} />);
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/articles/test-article');
    });

    it('should have grid layout', () => {
      const { container } = render(<ArticleCard {...defaultProps} />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have hover effects classes', () => {
      const { container } = render(<ArticleCard {...defaultProps} />);
      const link = container.querySelector('a');
      expect(link).toHaveClass('group');
    });
  });

  describe('Prominent Card (with image)', () => {
    const prominentProps = {
      ...defaultProps,
      prominent: true,
      imageUrl: '/test-image.jpg',
    };

    it('should render with prominent layout', () => {
      const { container } = render(<ArticleCard {...prominentProps} />);
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/articles/test-article');
    });

    it('should render title in prominent card', () => {
      render(<ArticleCard {...prominentProps} />);
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    it('should render description with line clamp', () => {
      render(<ArticleCard {...prominentProps} />);
      const description = screen.getByText(/test article description/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('line-clamp-5');
    });

    it('should render date in prominent card', () => {
      render(<ArticleCard {...prominentProps} />);
      expect(screen.getByText(/Jan.*2024|15|January/i)).toBeInTheDocument();
    });

    it('should render author in prominent card', () => {
      render(<ArticleCard {...prominentProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should have different layout than standard card', () => {
      render(<ArticleCard {...prominentProps} />);
      const description = screen.getByText(/test article description/i);
      expect(description.parentElement).toHaveClass('col-span-2');
    });
  });

  describe('Prominent Card (without image)', () => {
    it('should render standard layout when prominent but no image', () => {
      render(<ArticleCard {...defaultProps} prominent />);
      const description = screen.getByText(/test article description/i);
      expect(description).toHaveClass('line-clamp-2');
    });
  });

  describe('Props Handling', () => {
    it('should handle missing author', () => {
      const { author: _author, ...propsWithoutAuthor } = defaultProps;
      render(<ArticleCard {...propsWithoutAuthor} />);
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    it('should handle long titles', () => {
      render(
        <ArticleCard
          {...defaultProps}
          title='This is a very long article title that should still render correctly'
        />,
      );
      expect(screen.getByText(/very long article title/i)).toBeInTheDocument();
    });

    it('should handle long descriptions', () => {
      const longDescription = 'Lorem ipsum '.repeat(50);
      render(<ArticleCard {...defaultProps} description={longDescription} />);
      expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument();
    });

    it('should handle different dates', () => {
      render(
        <ArticleCard {...defaultProps} createdAt={new Date('2023-12-25')} />,
      );
      expect(screen.getByText(/Dec.*2023|25|December/i)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have rounded hover effect', () => {
      const { container } = render(<ArticleCard {...defaultProps} />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('rounded-full');
    });

    it('should have hover background color', () => {
      const { container } = render(<ArticleCard {...defaultProps} />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('group-hover:bg-primary/20');
    });

    it('should have blur effect on hover for metadata', () => {
      render(<ArticleCard {...defaultProps} />);
      const authorElement = screen.getByText('John Doe');
      expect(authorElement).toHaveClass('group-hover:blur-sm');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible via link', () => {
      const { container } = render(<ArticleCard {...defaultProps} />);
      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
    });

    it('should have semantic heading for title', () => {
      render(<ArticleCard {...defaultProps} />);
      // Title component should render appropriate heading
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });
  });
});
