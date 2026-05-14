import type { ReactNode } from 'react';

export type FormGridColumns = number | { sm?: number; md?: number; lg?: number; xl?: number };

export interface FormGridProps {
  columns?: FormGridColumns;
  gap?: number;
  children?: ReactNode;
}

export function resolveColumns(cols: FormGridColumns, viewportWidth: number): number {
  if (typeof cols === 'number') return Math.max(1, cols);
  if (viewportWidth >= 1280 && cols.xl) return cols.xl;
  if (viewportWidth >= 1024 && cols.lg) return cols.lg;
  if (viewportWidth >= 768 && cols.md) return cols.md;
  if (viewportWidth >= 640 && cols.sm) return cols.sm;
  return cols.sm ?? cols.md ?? cols.lg ?? cols.xl ?? 1;
}
