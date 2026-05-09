export interface LatencyHeatmapProps {
  /** 2D matrix of cell values (rows × cols). */
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
  /** Min/max for color scaling. Default = compute from data. */
  min?: number;
  max?: number;
  ariaLabel?: string;
}

/** Compute color in OKLCH lerp from green→red based on ratio 0..1. */
export function ratioColor(ratio: number): string {
  const r = Math.max(0, Math.min(1, ratio));
  // green (152) → yellow (78) → red (22) hue lerp
  let h = 152;
  if (r <= 0.5) h = 152 + (78 - 152) * (r * 2);
  else h = 78 + (22 - 78) * ((r - 0.5) * 2);
  return `oklch(70% 0.16 ${h.toFixed(0)})`;
}
