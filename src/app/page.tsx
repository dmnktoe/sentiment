import Hero from '@/components/templates/Hero';
import Latest from '@/components/templates/Latest';

async function getArticles() {
  const baseUrl = 'https://cms.project-sentiment.org';
  const path = '/api/articles';

  const url = new URL(path, baseUrl);

  const res = await fetch(url);

  if (!res.ok) throw new Error('Failed to fetch team members');

  const data = await res.json();

  return data.data;
}

export default async function Home() {
  const articles = await getArticles();
  return (
    <section>
      <Hero />
      <Latest news={articles} />
    </section>
  );
}
