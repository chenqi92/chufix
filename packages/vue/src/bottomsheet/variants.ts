export type SheetSnap = number | 'auto' | string;

export interface BottomSheetProps {
  open?: boolean;
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
  /** Initial snap point index (within `snapPoints`). Default 0. */
  initialSnap?: number;
  /** Show the top grabber bar. Default true. */
  showGrabber?: boolean;
  /** Close on overlay click. Default true. */
  maskClosable?: boolean;
  /** Close on Esc. Default true. */
  closeOnEsc?: boolean;
  /** Render mask layer. Default true. */
  mask?: boolean;
  /** Allow dragging the grabber below the smallest snap point to close. Default true. */
  dismissible?: boolean;
  /** Teleport target. Default 'body'. */
  to?: string;
  /** Optional override z-index. */
  zIndex?: number;
  /** Optional title for the header (rendered above content). */
  title?: string;
}

/**
 * Resolve a snap point to a px height. Returns 0 if window unavailable.
 */
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

/** Find the closest snap point index given a current height. */
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
