import { Container } from '@/components/layout/Container';
import ArticleCard from '@/components/templates/ArticleCard';
import Crossbar from '@/components/templates/Crossbar';
import { Title } from '@/components/ui/typography/Title';
import { Article } from '@/types/Article';

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <div className='px-2 sm:px-4'>
          <Title size='two' className='sm:mb-16'>
            ({articles.length}) articles
          </Title>
          <div className='flex flex-col gap-y-16'>
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                publishedAt={article.publishedAt}
                slug={article.slug}
                description={article.description}
                prominent={true}
                imageUrl={article.image.url}
                tags={article.tags}
                author={article.author}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
