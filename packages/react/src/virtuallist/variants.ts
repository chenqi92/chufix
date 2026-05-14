import type { ReactNode } from 'react';

export type ItemHeight<T> = number | ((item: T, index: number) => number);

export interface VirtualListProps<T = unknown> {
  items: T[];
  itemHeight: ItemHeight<T>;
  overscan?: number;
  height?: number | string;
  scrollToIndex?: number;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
}

export interface VirtualWindow {
  start: number;
  end: number;
  offsetTop: number;
  totalHeight: number;
}

interface ComputeArgs<T> {
  items: T[];
  itemHeight: ItemHeight<T>;
  overscan: number;
  scrollTop: number;
  viewportHeight: number;
}

export function computeWindow<T>({ items, itemHeight, overscan, scrollTop, viewportHeight }: ComputeArgs<T>): VirtualWindow {
  if (items.length === 0) return { start: 0, end: 0, offsetTop: 0, totalHeight: 0 };
  if (typeof itemHeight === 'number') {
    const h = itemHeight;
    const total = items.length * h;
    const rawStart = Math.floor(scrollTop / h);
    const visibleCount = Math.ceil(viewportHeight / h);
    const start = Math.max(0, rawStart - overscan);
    const end = Math.min(items.length, rawStart + visibleCount + overscan);
    return { start, end, offsetTop: start * h, totalHeight: total };
  }
  let start = 0;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    const h = itemHeight(items[i], i);
    if (acc + h > scrollTop) {
      start = Math.max(0, i - overscan);
      break;
    }
    acc += h;
  }
  let off = 0;
  for (let i = 0; i < start; i++) off += itemHeight(items[i], i);
  let consumed = 0;
  let end = start;
  for (let i = start; i < items.length; i++) {
    if (consumed > viewportHeight + overscan * 40) break;
    consumed += itemHeight(items[i], i);
    end = i + 1;
  }
  let total = 0;
  for (let i = 0; i < items.length; i++) total += itemHeight(items[i], i);
  return { start, end, offsetTop: off, totalHeight: total };
}
