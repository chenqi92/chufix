export type ScrollAreaSize = 'sm' | 'md' | 'lg';

export interface ScrollAreaProps {
  maxHeight?: number | string;
  maxWidth?: number | string;
  size?: ScrollAreaSize;
  bordered?: boolean;
  axis?: 'y' | 'x' | 'both';
  className?: string;
  children?: import('react').ReactNode;
}

export function scrollAreaClass(p: {
  size: ScrollAreaSize;
  bordered: boolean;
  axis: 'y' | 'x' | 'both';
  className?: string;
}): string {
  return [
    'cf-scrollarea',
    `cf-scrollarea--${p.size}`,
    `cf-scrollarea--${p.axis}`,
    p.bordered && 'is-bordered',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
