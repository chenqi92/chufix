export type DescriptionListLayout = 'horizontal' | 'vertical';
export type DescriptionListSize = 'sm' | 'md' | 'lg';

export interface DescriptionItem {
  key?: string;
  term: string;
  description?: string;
  span?: number;
}

export interface DescriptionListProps {
  items?: DescriptionItem[];
  layout?: DescriptionListLayout;
  size?: DescriptionListSize;
  columns?: number;
  bordered?: boolean;
  termWidth?: number | string;
  title?: string;
}

export function descriptionListClass(p: {
  layout: DescriptionListLayout;
  size: DescriptionListSize;
  bordered: boolean;
}): string {
  return [
    'cf-dl',
    `cf-dl--${p.layout}`,
    `cf-dl--${p.size}`,
    p.bordered && 'is-bordered',
  ]
    .filter(Boolean)
    .join(' ');
}
