export type FormGridColumns = number | { sm?: number; md?: number; lg?: number; xl?: number };

export interface FormGridProps {
  /** Fixed column count, or per-breakpoint object. Default { sm: 1, md: 2 }. */
  columns?: FormGridColumns;
  /** Grid gap in px. Default 16. */
  gap?: number;
}

/** Resolve a single column count at the current viewport width. */
export function resolveColumns(cols: FormGridColumns, viewportWidth: number): number {
  if (typeof cols === 'number') return Math.max(1, cols);
  // 640 / 768 / 1024 / 1280 — aligned with --bp-* tokens
  if (viewportWidth >= 1280 && cols.xl) return cols.xl;
  if (viewportWidth >= 1024 && cols.lg) return cols.lg;
  if (viewportWidth >= 768 && cols.md) return cols.md;
  if (viewportWidth >= 640 && cols.sm) return cols.sm;
  return cols.sm ?? cols.md ?? cols.lg ?? cols.xl ?? 1;
}
