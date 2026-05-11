export interface LegendSeries {
  name: string;
  colorIndex: number;
  hidden?: boolean;
}

export interface ChartToolbarProps {
  title?: string;
  subtitle?: string;
  series?: LegendSeries[];
  showZoom?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  onSeriesToggle?: (name: string, series: LegendSeries) => void;
  onAction?: (kind: 'zoom-in' | 'zoom-out' | 'export' | 'refresh') => void;
  className?: string;
}
