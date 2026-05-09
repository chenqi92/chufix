export type StatusIllustrationVariant =
  | 'empty'
  | 'search'
  | 'upload'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'not-found'
  | 'forbidden'
  | 'server-error';

export type StatusIllustrationSize = 'sm' | 'md' | 'lg';

export interface StatusIllustrationProps {
  variant?: StatusIllustrationVariant;
  size?: StatusIllustrationSize;
  title?: string;
  className?: string;
}

export function statusIllustrationClass(p: {
  variant: StatusIllustrationVariant;
  size: StatusIllustrationSize;
  className?: string;
}): string {
  return [
    'cf-status-illustration',
    `cf-status-illustration--${p.variant}`,
    `cf-status-illustration--${p.size}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
