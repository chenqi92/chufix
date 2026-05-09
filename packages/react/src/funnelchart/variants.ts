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
  className?: string;
}
