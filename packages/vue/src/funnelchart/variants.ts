export interface FunnelStep {
  label: string;
  value: number;
}

export interface FunnelChartProps {
  steps: FunnelStep[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
}

export interface FunnelChartInteractionPayload {
  step: FunnelStep;
  dataIndex: number;
  nativeEvent?: PointerEvent;
}
