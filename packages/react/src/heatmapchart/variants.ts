export type HeatmapColorScale =
  | 'green-red'
  | 'blue-red'
  | 'mono-accent'
  | 'mono-blue'
  | 'viridis'
  | ((ratio: number) => string);

export interface HeatmapChartInteractionPayload {
  row: number;
  col: number;
  value: number;
  rowLabel?: string;
  colLabel?: string;
  ratio: number;
  nativeEvent?: unknown;
}

export interface HeatmapChartProps {
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  colorScale?: HeatmapColorScale;
  showValueLabels?: boolean;
  valueDigits?: number;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: HeatmapChartInteractionPayload) => void;
  onItemLeave?: (payload: HeatmapChartInteractionPayload) => void;
}

export function resolveColorScale(
  scale: HeatmapColorScale | undefined,
): (ratio: number) => string {
  if (typeof scale === 'function') return scale;
  switch (scale) {
    case 'blue-red':
      return (r) => {
        const ratio = Math.max(0, Math.min(1, r));
        let h = 240;
        if (ratio <= 0.5) h = 240 + (320 - 240) * (ratio * 2);
        else h = 320 + (22 - 320 + 360) * ((ratio - 0.5) * 2);
        h = ((h % 360) + 360) % 360;
        return `oklch(70% 0.16 ${h.toFixed(0)})`;
      };
    case 'mono-accent':
      return (r) => `oklch(64% 0.16 263 / ${(0.18 + 0.82 * Math.max(0, Math.min(1, r))).toFixed(3)})`;
    case 'mono-blue':
      return (r) => `oklch(60% 0.14 240 / ${(0.18 + 0.82 * Math.max(0, Math.min(1, r))).toFixed(3)})`;
    case 'viridis':
      return (r) => {
        const ratio = Math.max(0, Math.min(1, r));
        let h = 290;
        if (ratio <= 0.5) h = 290 + (180 - 290) * (ratio * 2);
        else h = 180 + (110 - 180) * ((ratio - 0.5) * 2);
        return `oklch(${(40 + 40 * ratio).toFixed(0)}% 0.14 ${h.toFixed(0)})`;
      };
    case 'green-red':
    default:
      return (r) => {
        const ratio = Math.max(0, Math.min(1, r));
        let h = 152;
        if (ratio <= 0.5) h = 152 + (78 - 152) * (ratio * 2);
        else h = 78 + (22 - 78) * ((ratio - 0.5) * 2);
        return `oklch(70% 0.16 ${h.toFixed(0)})`;
      };
  }
}
