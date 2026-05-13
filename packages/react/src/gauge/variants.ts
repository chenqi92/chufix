export interface GaugeClickPayload {
  value: number;
  /** Normalized ratio between min and max (0..1). */
  ratio: number;
  nativeEvent?: unknown;
}

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  thickness?: number;
  sweep?: number;
  label?: string;
  unit?: string;
  tone?: 'accent' | 'success' | 'warning' | 'error';
  ariaLabel?: string;
  className?: string;
  onClick?: (payload: GaugeClickPayload) => void;
}
