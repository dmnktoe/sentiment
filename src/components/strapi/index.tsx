import React from 'react';

import { RichTextBlock } from './rich-text-block';
import { TitleBlock } from './title-block';

type PageBlock = TitleBlock | RichTextBlock;

const blocks: Record<
  PageBlock['__component'],
  React.ComponentType<{ block: PageBlock }>
> = {
  'blocks.title': ({ block }: { block: PageBlock }) => (
    <TitleBlock block={block as TitleBlock} />
  ),
  'blocks.rich-text': ({ block }: { block: PageBlock }) => (
    <RichTextBlock block={block as RichTextBlock} />
  ),
};

function BlockRenderer({ block }: { block: PageBlock }) {
  const BlockComponent = blocks[block.__component];
  return BlockComponent ? <BlockComponent block={block} /> : null;
}

export { BlockRenderer };
export type { PageBlock };
