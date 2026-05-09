export type DescriptionListLayout = 'horizontal' | 'vertical';
export type DescriptionListSize = 'sm' | 'md' | 'lg';

export interface DescriptionItem {
  key?: string;
  term: import('react').ReactNode;
  description?: import('react').ReactNode;
  span?: number;
}

export interface DescriptionListProps {
  items?: DescriptionItem[];
  layout?: DescriptionListLayout;
  size?: DescriptionListSize;
  columns?: number;
  bordered?: boolean;
  termWidth?: number | string;
  title?: import('react').ReactNode;
  className?: string;
  children?: import('react').ReactNode;
}

export function descriptionListClass(p: {
  layout: DescriptionListLayout;
  size: DescriptionListSize;
  bordered: boolean;
  className?: string;
}): string {
  return [
    'cf-dl',
    `cf-dl--${p.layout}`,
    `cf-dl--${p.size}`,
    p.bordered && 'is-bordered',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
