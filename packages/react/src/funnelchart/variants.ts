export interface FunnelStep {
  label: string;
  value: number;
}

export interface FunnelChartInteractionPayload {
  step: FunnelStep;
  dataIndex: number;
  nativeEvent?: unknown;
}

export interface FunnelChartProps {
  steps: FunnelStep[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: FunnelChartInteractionPayload) => void;
  onItemLeave?: (payload: FunnelChartInteractionPayload) => void;
}
