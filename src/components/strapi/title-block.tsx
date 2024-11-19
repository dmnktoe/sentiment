import { Title } from '@/components/ui/typography/Title';

export interface TitleBlock {
  __component: 'blocks.title';
  id: number;
  content: string;
}

export function TitleBlock({ block }: { block: TitleBlock }) {
  return (
    <Title size='two' margin={false}>
      {block.content}
    </Title>
  );
}
