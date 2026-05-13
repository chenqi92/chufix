export type WaterfallStepKind = 'delta' | 'total';

export interface WaterfallStep {
  label: string;
  value: number;
  kind?: WaterfallStepKind;
}

export interface WaterfallChartInteractionPayload {
  step: WaterfallStep;
  dataIndex: number;
  cumulative: number;
  delta: number;
  nativeEvent?: unknown;
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  valueFormatter?: (value: number) => string;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: WaterfallChartInteractionPayload) => void;
  onItemLeave?: (payload: WaterfallChartInteractionPayload) => void;
}
