import type { ReactNode } from 'react';

export type SheetSnap = number | 'auto' | string;

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Heights the sheet can rest at, from smallest to largest.
   *
   * - `number` — px height
   * - `'40%'` / `'90%'` — percent of window inner height
   * - `'auto'` — content height (clamped to 90% of window)
   *
   * Default `['40%', '90%']`.
   */
  snapPoints?: SheetSnap[];
  initialSnap?: number;
  showGrabber?: boolean;
  maskClosable?: boolean;
  closeOnEsc?: boolean;
  mask?: boolean;
  dismissible?: boolean;
  container?: HTMLElement | null;
  zIndex?: number;
  title?: string;
  onSnapChange?: (index: number) => void;
  children?: ReactNode;
}

export function resolveSnap(snap: SheetSnap, windowH: number, contentH: number): number {
  if (typeof snap === 'number') return snap;
  if (snap === 'auto') return Math.min(contentH, Math.floor(windowH * 0.9));
  if (snap.endsWith('%')) {
    const pct = parseFloat(snap);
    return Math.floor((windowH * pct) / 100);
  }
  const n = parseFloat(snap);
  return Number.isFinite(n) ? n : 0;
}

export function nearestSnapIndex(heights: number[], h: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < heights.length; i++) {
    const d = Math.abs(heights[i] - h);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}
