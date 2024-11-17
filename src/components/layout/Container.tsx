import * as React from 'react';

import clsxm from '@/lib/clsxm';

export const Container = ({
  children,
  className,
  width = 'max-w-[var(--max-width)]',
}: {
  children: React.ReactNode;
  className?: string;
  width?: string;
}) => {
  return <div className={clsxm('mx-auto lg:px-0 sm:px-4 px-2', width, className)}>{children}</div>;
};
