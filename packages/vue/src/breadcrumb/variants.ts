export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  /** 自定义分隔符，默认 / */
  separator?: string;
}

export function breadcrumbClass(): string {
  return 'cf-breadcrumb';
}
