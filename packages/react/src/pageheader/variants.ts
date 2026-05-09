export type PageHeaderSize = 'sm' | 'md' | 'lg';

export interface PageHeaderProps {
  title?: import('react').ReactNode;
  description?: import('react').ReactNode;
  breadcrumb?: import('react').ReactNode;
  back?: import('react').ReactNode;
  actions?: import('react').ReactNode;
  toolbar?: import('react').ReactNode;
  tabs?: import('react').ReactNode;
  size?: PageHeaderSize;
  bordered?: boolean;
  className?: string;
}

export function pageHeaderClass(p: {
  size: PageHeaderSize;
  bordered: boolean;
  className?: string;
}): string {
  return [
    'cf-page-header',
    `cf-page-header--${p.size}`,
    p.bordered && 'is-bordered',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
