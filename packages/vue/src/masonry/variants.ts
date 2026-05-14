export interface MasonryProps {
  /** Fixed column count; overrides minColumnWidth when provided. */
  columns?: number;
  /** Auto-compute column count by container width / minColumnWidth. Default 240. */
  minColumnWidth?: number;
  /** Gap between items (px). Default 12. */
  gap?: number;
}

export function computeColumns(width: number, opts: { columns?: number; minColumnWidth?: number }): number {
  if (typeof opts.columns === 'number' && opts.columns > 0) return opts.columns;
  const min = opts.minColumnWidth ?? 240;
  return Math.max(1, Math.floor(width / min));
}
