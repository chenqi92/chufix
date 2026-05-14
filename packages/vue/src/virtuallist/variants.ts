export type ItemHeight<T> = number | ((item: T, index: number) => number);

export interface VirtualListProps<T = unknown> {
  items: T[];
  /** Fixed row height (number) or per-item function. */
  itemHeight: ItemHeight<T>;
  /** Number of extra rows above/below viewport. Default 5. */
  overscan?: number;
  /** Container height. number=px, string passed through. */
  height?: number | string;
  /** Imperatively scroll a specific index into view (top-aligned). */
  scrollToIndex?: number;
  /** Extra root class. */
  className?: string;
  /** Optional stable key resolver for v-for / map. */
  itemKey?: (item: T, index: number) => string | number;
}

export interface VirtualWindow {
  start: number;
  end: number;
  /** Pixel offset of the first rendered row from the top of the inner pad. */
  offsetTop: number;
  /** Total scroll height. */
  totalHeight: number;
}

interface ComputeArgs<T> {
  items: T[];
  itemHeight: ItemHeight<T>;
  overscan: number;
  scrollTop: number;
  viewportHeight: number;
}

/**
 * Compute the visible window with overscan. Supports fixed and variable heights.
 * For variable heights, walks linearly — fine up to ~10k rows; beyond that
 * consumers should pass a cached/closure-based itemHeight to avoid recomputation.
 */
export function computeWindow<T>({ items, itemHeight, overscan, scrollTop, viewportHeight }: ComputeArgs<T>): VirtualWindow {
  if (items.length === 0) {
    return { start: 0, end: 0, offsetTop: 0, totalHeight: 0 };
  }

  if (typeof itemHeight === 'number') {
    const h = itemHeight;
    const total = items.length * h;
    const rawStart = Math.floor(scrollTop / h);
    const visibleCount = Math.ceil(viewportHeight / h);
    const start = Math.max(0, rawStart - overscan);
    const end = Math.min(items.length, rawStart + visibleCount + overscan);
    return { start, end, offsetTop: start * h, totalHeight: total };
  }

  // variable heights — single linear pass
  let offsetTop = 0;
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

  // Recompute offsetTop for the adjusted start
  let off = 0;
  for (let i = 0; i < start; i++) off += itemHeight(items[i], i);
  offsetTop = off;

  // walk end
  let consumed = 0;
  let end = start;
  for (let i = start; i < items.length; i++) {
    if (consumed > viewportHeight + overscan * 40) break;
    consumed += itemHeight(items[i], i);
    end = i + 1;
  }

  // Total height
  let total = 0;
  for (let i = 0; i < items.length; i++) total += itemHeight(items[i], i);

  return { start, end, offsetTop, totalHeight: total };
}
