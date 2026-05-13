export interface BulletChartInteractionPayload {
  value: number;
  target?: number;
  max: number;
  nativeEvent?: unknown;
}

export interface BulletChartProps {
  value: number;
  target?: number;
  max: number;
  bands?: { upTo: number; tone?: 'error' | 'warning' | 'success' }[];
  width?: number;
  height?: number;
  label?: string;
  ariaLabel?: string;
  className?: string;
  onClick?: (payload: BulletChartInteractionPayload) => void;
  onItemEnter?: (payload: BulletChartInteractionPayload) => void;
  onItemLeave?: (payload: BulletChartInteractionPayload) => void;
}
