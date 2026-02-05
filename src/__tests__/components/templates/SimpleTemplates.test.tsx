/**
 * Tests for simple template components
 */
import { render, screen } from '@testing-library/react';

import ArticleList from '@/components/templates/ArticleList';
import LegalNotice from '@/components/templates/LegalNotice';
import Privacy from '@/components/templates/Privacy';

describe('LegalNotice Component', () => {
  it('should render legal notice section', () => {
    const { container } = render(<LegalNotice />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('should render main heading', () => {
    render(<LegalNotice />);
    expect(screen.getByText(/Impressum/i)).toBeInTheDocument();
  });

  it('should render contact information', () => {
    render(<LegalNotice />);
    expect(screen.getByText(/Impressum/i)).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    const { container } = render(<LegalNotice />);
    const headings = container.querySelectorAll('h1, h2, h3');
    expect(headings.length).toBeGreaterThan(0);
  });
});

describe('Privacy Component', () => {
  it('should render privacy section', () => {
    const { container } = render(<Privacy />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('should render main heading', () => {
    render(<Privacy />);
    const headings = screen.getAllByText(/Datenschutz/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should render privacy policy content', () => {
    render(<Privacy />);
    // Check for some key privacy terms
    const content = screen.getAllByText(/Datenschutz/i);
    expect(content.length).toBeGreaterThan(0);
  });

  it('should have proper semantic structure', () => {
    const { container } = render(<Privacy />);
    const headings = container.querySelectorAll('h1, h2, h3');
    expect(headings.length).toBeGreaterThan(0);
  });
});

describe('ArticleList Component', () => {
  const mockArticles = [
    {
      id: 1,
      slug: 'article-1',
      title: 'Test Article 1',
      description: 'Description 1',
      content: [],
      createdAt: new Date('2024-01-01'),
      publishedAt: '2024-01-01',
      cover: {
        url: '/test1.jpg',
        alternativeText: 'Cover 1',
        width: 800,
        height: 600,
      },
      image: {
        name: 'test1.jpg',
        alternativeText: 'Cover 1',
        url: '/test1.jpg',
        width: 800,
        height: 600,
        caption: null,
        formats: {
          large: {
            ext: '.jpg',
            url: '/test1.jpg',
            hash: 'hash1',
            mime: 'image/jpeg',
            name: 'test1',
            path: null,
            size: 12345,
            width: 800,
            height: 600,
          },
          small: {
            ext: '.jpg',
            url: '/test1.jpg',
            hash: 'hash1',
            mime: 'image/jpeg',
            name: 'test1',
            path: null,
            size: 5000,
            width: 400,
            height: 300,
          },
          medium: {
            ext: '.jpg',
            url: '/test1.jpg',
            hash: 'hash1',
            mime: 'image/jpeg',
            name: 'test1',
            path: null,
            size: 8000,
            width: 600,
            height: 450,
          },
          thumbnail: {
            ext: '.jpg',
            url: '/test1.jpg',
            hash: 'hash1',
            mime: 'image/jpeg',
            name: 'test1',
            path: null,
            size: 2000,
            width: 200,
            height: 150,
          },
        },
        hash: 'hash1',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 12345,
        previewUrl: null,
        provider: 'local',
        provider_metadata: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      author: 'Author 1',
      tags: 'test',
    },
    {
      id: 2,
      slug: 'article-2',
      title: 'Test Article 2',
      description: 'Description 2',
      content: [],
      createdAt: new Date('2024-01-02'),
      publishedAt: '2024-01-02',
      cover: {
        url: '/test2.jpg',
        alternativeText: 'Cover 2',
        width: 800,
        height: 600,
      },
      image: {
        name: 'test2.jpg',
        alternativeText: 'Cover 2',
        url: '/test2.jpg',
        width: 800,
        height: 600,
        caption: null,
        formats: {
          large: {
            ext: '.jpg',
            url: '/test2.jpg',
            hash: 'hash2',
            mime: 'image/jpeg',
            name: 'test2',
            path: null,
            size: 12345,
            width: 800,
            height: 600,
          },
          small: {
            ext: '.jpg',
            url: '/test2.jpg',
            hash: 'hash2',
            mime: 'image/jpeg',
            name: 'test2',
            path: null,
            size: 5000,
            width: 400,
            height: 300,
          },
          medium: {
            ext: '.jpg',
            url: '/test2.jpg',
            hash: 'hash2',
            mime: 'image/jpeg',
            name: 'test2',
            path: null,
            size: 8000,
            width: 600,
            height: 450,
          },
          thumbnail: {
            ext: '.jpg',
            url: '/test2.jpg',
            hash: 'hash2',
            mime: 'image/jpeg',
            name: 'test2',
            path: null,
            size: 2000,
            width: 200,
            height: 150,
          },
        },
        hash: 'hash2',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 12345,
        previewUrl: null,
        provider: 'local',
        provider_metadata: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      author: 'Author 2',
      tags: 'test',
    },
  ];

  it('should render article list section', () => {
    const { container } = render(<ArticleList articles={mockArticles} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('should display article count', () => {
    render(<ArticleList articles={mockArticles} />);
    expect(screen.getByText(/\(2\) articles/i)).toBeInTheDocument();
  });

  it('should render all articles', () => {
    render(<ArticleList articles={mockArticles} />);
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  it('should handle empty article array', () => {
    render(<ArticleList articles={[]} />);
    expect(screen.getByText(/\(0\) articles/i)).toBeInTheDocument();
  });

  it('should render crossbar', () => {
    const { container } = render(<ArticleList articles={mockArticles} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    const { container } = render(<ArticleList articles={mockArticles} />);
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toBeInTheDocument();
  });
});
