export interface InfiniteScrollProps {
  loading?: boolean;
  finished?: boolean;
  threshold?: number;
  className?: string;
}

export function infiniteScrollClass(p: { className?: string }): string {
  return ['cf-infscroll', p.className].filter(Boolean).join(' ');
}
