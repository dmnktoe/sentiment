import type { ComponentPropsWithoutRef, ElementType } from 'react';
import * as React from 'react';

export type ListProps = ComponentPropsWithoutRef<'ul'> & {
  ordered?: boolean;
};

export const List = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  ListProps
>(({ ordered = false, className = '', ...props }, ref) => {
  const Component: ElementType = ordered ? 'ol' : 'ul';
  const baseClasses = ordered
    ? 'list-decimal pl-5 space-y-2 mb-4'
    : 'list-disc pl-5 space-y-2 mb-4';

  return (
    <Component
      ref={ref as React.Ref<HTMLUListElement & HTMLOListElement>}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
});

List.displayName = 'List';

export type ListItemProps = ComponentPropsWithoutRef<'li'>;

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className = '', ...props }, ref) => {
    return <li ref={ref} className={className} {...props} />;
  },
);

ListItem.displayName = 'ListItem';
