export interface VirtualGridProps<T = unknown> {
  items: T[];
  /** Fixed row height (px). */
  itemHeight: number;
  /** Auto-fit columns: column count is floor(width / minColumnWidth). */
  minColumnWidth?: number;
  /** Or force a column count, ignoring minColumnWidth. */
  columns?: number;
  /** Gap between columns/rows. Default 8. */
  gap?: number;
  /** Overscan rows. Default 2. */
  overscan?: number;
  /** Container height. */
  height?: number | string;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
}

export interface GridWindow {
  rowStart: number;
  rowEnd: number;
  totalRows: number;
  cols: number;
  cellWidth: number;
  rowHeight: number;
}

interface ComputeArgs {
  totalItems: number;
  containerWidth: number;
  itemHeight: number;
  scrollTop: number;
  viewportHeight: number;
  gap: number;
  overscan: number;
  columns?: number;
  minColumnWidth?: number;
}

export function computeGrid(args: ComputeArgs): GridWindow {
  const cols = Math.max(
    1,
    args.columns ?? Math.floor((args.containerWidth + args.gap) / ((args.minColumnWidth ?? 200) + args.gap)),
  );
  const cellWidth = (args.containerWidth - args.gap * (cols - 1)) / cols;
  const rowHeight = args.itemHeight + args.gap;
  const totalRows = Math.ceil(args.totalItems / cols);
  const rawStart = Math.floor(args.scrollTop / rowHeight);
  const visibleRows = Math.ceil(args.viewportHeight / rowHeight);
  const rowStart = Math.max(0, rawStart - args.overscan);
  const rowEnd = Math.min(totalRows, rawStart + visibleRows + args.overscan);
  return { rowStart, rowEnd, totalRows, cols, cellWidth, rowHeight };
}
