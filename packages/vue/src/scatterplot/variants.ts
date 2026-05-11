export interface ScatterPoint {
  x: number;
  y: number;
  r?: number;
  group?: string;
  label?: string;
}

export interface ScatterPlotInteractionPayload {
  point: ScatterPoint;
  dataIndex: number;
  groupIndex: number;
  nativeEvent?: MouseEvent;
}

export interface ScatterPlotProps {
  data: ScatterPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  tooltipFormatter?: (payload: ScatterPlotInteractionPayload) => string;
  ariaLabel?: string;
}
