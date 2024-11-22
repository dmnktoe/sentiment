import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import ProjectCard from '@/components/templates/ProjectCard';
import { Title } from '@/components/ui/typography/Title';
import { Project } from '@/types/Project';

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <Title size='two' className='sm:mb-16'>
          ({projects.length}) projects in ({projects.length}) categories
        </Title>
        <div className='flex flex-col gap-y-16'>
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              slug={project.slug}
              description={project.description}
              createdAt={new Date()}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
