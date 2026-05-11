export interface StackedBar100Series {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface StackedBar100Props {
  segments: StackedBar100Series[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  ariaLabel?: string;
  className?: string;
}
