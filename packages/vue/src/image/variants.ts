export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: ImageFit;
  rounded?: boolean;
  bordered?: boolean;
  fallback?: string;
  lazy?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export function imageClass(p: {
  rounded: boolean;
  bordered: boolean;
  state: 'loading' | 'loaded' | 'error';
  className?: string;
}): string {
  return [
    'cf-image',
    p.rounded && 'is-rounded',
    p.bordered && 'is-bordered',
    `is-${p.state}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
