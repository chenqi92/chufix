import type { ReactNode } from 'react';

export interface MasonryProps {
  columns?: number;
  minColumnWidth?: number;
  gap?: number;
  children?: ReactNode;
}

export function computeColumns(width: number, opts: { columns?: number; minColumnWidth?: number }): number {
  if (typeof opts.columns === 'number' && opts.columns > 0) return opts.columns;
  const min = opts.minColumnWidth ?? 240;
  return Math.max(1, Math.floor(width / min));
}
