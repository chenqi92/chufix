export interface LatencyHeatmapProps {
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  ariaLabel?: string;
  className?: string;
}

export function ratioColor(ratio: number): string {
  const r = Math.max(0, Math.min(1, ratio));
  let h = 152;
  if (r <= 0.5) h = 152 + (78 - 152) * (r * 2);
  else h = 78 + (22 - 78) * ((r - 0.5) * 2);
  return `oklch(70% 0.16 ${h.toFixed(0)})`;
}
