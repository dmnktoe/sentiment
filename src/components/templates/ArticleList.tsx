import { Container } from '@/components/layout/Container';
import Card from '@/components/templates/ArticleCard';
import Crossbar from '@/components/templates/Crossbar';
import { Title } from '@/components/ui/typography/Title';
import { Article } from '@/types/Article';

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <section className='py-36'>
      <Container>
        <Crossbar />
        <Title size='two' className='sm:mb-16'>
          ({articles.length}) articles in ({articles.length}) categories
        </Title>
        <div className='flex flex-col gap-y-16'>
          {articles.map((article) => (
            <Card
              key={article.slug}
              title={article.title}
              publishedAt={article.publishedAt}
              slug={article.slug}
              description={article.description}
              prominent={true}
              imageUrl={article.image.url}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
