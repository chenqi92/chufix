export type HeatmapColorScale =
  | 'green-red'
  | 'blue-red'
  | 'mono-accent'
  | 'mono-blue'
  | 'viridis'
  | ((ratio: number) => string);

export interface HeatmapChartProps {
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  /** Color scale: preset name or custom function (ratio 0..1) → CSS color. Default 'green-red'. */
  colorScale?: HeatmapColorScale;
  /** Render value label inside each cell when cell is big enough. */
  showValueLabels?: boolean;
  /** Decimal places for in-cell value labels. */
  valueDigits?: number;
  ariaLabel?: string;
}

export interface HeatmapChartInteractionPayload {
  row: number;
  col: number;
  value: number;
  rowLabel?: string;
  colLabel?: string;
  ratio: number;
  nativeEvent?: PointerEvent;
}

/** Resolve a colorScale prop to a function. */
export function resolveColorScale(
  scale: HeatmapColorScale | undefined,
): (ratio: number) => string {
  if (typeof scale === 'function') return scale;
  switch (scale) {
    case 'blue-red':
      return (r) => {
        const ratio = Math.max(0, Math.min(1, r));
        // blue (240) → magenta (320) → red (22) hue lerp
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
        // purple (290) → teal (180) → yellow-green (110)
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
