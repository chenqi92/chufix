export type ScrollAreaSize = 'sm' | 'md' | 'lg';

export interface ScrollAreaProps {
  maxHeight?: number | string;
  maxWidth?: number | string;
  size?: ScrollAreaSize;
  bordered?: boolean;
  /** Scroll axis. */
  axis?: 'y' | 'x' | 'both';
}

export function scrollAreaClass(p: {
  size: ScrollAreaSize;
  bordered: boolean;
  axis: 'y' | 'x' | 'both';
}): string {
  return [
    'cf-scrollarea',
    `cf-scrollarea--${p.size}`,
    `cf-scrollarea--${p.axis}`,
    p.bordered && 'is-bordered',
  ]
    .filter(Boolean)
    .join(' ');
}
