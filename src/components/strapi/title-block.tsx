import { Title, TitleProps } from '@/components/ui/typography/Title';

export interface TitleBlock extends TitleProps {
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
