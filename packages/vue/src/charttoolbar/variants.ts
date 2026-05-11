export interface LegendSeries {
  name: string;
  colorIndex: number;
  hidden?: boolean;
}

export interface ChartToolbarProps {
  title?: string;
  subtitle?: string;
  series?: LegendSeries[];
  /** Predefined zoom / brush actions. */
  showZoom?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
}
