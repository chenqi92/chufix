export type PageHeaderSize = 'sm' | 'md' | 'lg';

export interface PageHeaderProps {
  title?: string;
  description?: string;
  size?: PageHeaderSize;
  bordered?: boolean;
}

export function pageHeaderClass(p: {
  size: PageHeaderSize;
  bordered: boolean;
}): string {
  return [
    'cf-page-header',
    `cf-page-header--${p.size}`,
    p.bordered && 'is-bordered',
  ]
    .filter(Boolean)
    .join(' ');
}
