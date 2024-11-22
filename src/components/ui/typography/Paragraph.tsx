import clsxm from '@/lib/clsxm';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'light';
  isStrong?: boolean;
  margin?: boolean;
  size?: 'sm' | 'base';
  isJustify?: boolean;
}

export default function Paragraph({
  children,
  className,
  color = 'default',
  isStrong = false,
  margin = true,
  size = 'base',
  isJustify = false,
}: ParagraphProps) {
  return (
    <p
      className={clsxm(
        className,
        {
          'text-gray-700': color === 'default',
          'text-gray-500': color === 'light',
          'font-semibold': isStrong,
          'mb-6': margin,
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-justify': isJustify,
        },
        'leading-relaxed'
      )}
    >
      {children}
    </p>
  );
}
