export type WaterfallStepKind = 'delta' | 'total';

export interface WaterfallStep {
  label: string;
  /** Signed delta value. Ignored for kind='total' (recomputed). */
  value: number;
  /** `delta` = stacks on previous running total; `total` = absolute pillar (start/subtotal/end). */
  kind?: WaterfallStepKind;
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  /** Format the value label printed above each bar. Defaults to (v) => v.toFixed(0). */
  valueFormatter?: (value: number) => string;
  ariaLabel?: string;
}

export interface WaterfallChartInteractionPayload {
  step: WaterfallStep;
  dataIndex: number;
  cumulative: number;
  delta: number;
  nativeEvent?: PointerEvent;
}
