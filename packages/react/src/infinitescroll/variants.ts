import type { ReactNode } from 'react';

export interface InfiniteScrollProps {
  children?: ReactNode;
  loading?: boolean;
  finished?: boolean;
  threshold?: number;
  className?: string;
  loadingNode?: ReactNode;
  finishedNode?: ReactNode;
  onLoad?: () => void;
}

export function infiniteScrollClass(p: { className?: string }): string {
  return ['cf-infscroll', p.className].filter(Boolean).join(' ');
}
