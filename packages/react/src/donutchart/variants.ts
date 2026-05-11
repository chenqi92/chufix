export interface DonutSegment {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  ariaLabel?: string;
  className?: string;
}
