import React, { RefObject } from 'react';

import clsxm from '@/lib/clsxm';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'light';
  isStrong?: boolean;
  margin?: boolean;
  size?: 'sm' | 'base';
  ref?: RefObject<HTMLParagraphElement>;
}

export default function Paragraph({
  children,
  className,
  color = 'default',
  isStrong = false,
  margin = true,
  size = 'base',
  ref,
}: ParagraphProps) {
  return (
    <p
      className={clsxm(className, {
        'text-text': color === 'default',
        'text-tertiary': color === 'light',
        'font-semibold': isStrong,
        'mb-4': margin,
        'text-sm': size === 'sm',
        'text-base': size === 'base',
      })}
      ref={ref}
    >
      {children}
    </p>
  );
}
