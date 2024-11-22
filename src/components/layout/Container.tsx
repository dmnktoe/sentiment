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
  return (
    <div className={clsxm('mx-auto px-2 sm:px-4', width, className)}>
      {children}
    </div>
  );
};
