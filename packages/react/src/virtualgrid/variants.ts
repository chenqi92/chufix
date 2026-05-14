import type { ReactNode } from 'react';

export interface VirtualGridProps<T = unknown> {
  items: T[];
  itemHeight: number;
  minColumnWidth?: number;
  columns?: number;
  gap?: number;
  overscan?: number;
  height?: number | string;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
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
