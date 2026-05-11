export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  thickness?: number;
  /** Sweep angle in degrees (180 = half circle, 270 = three-quarter). */
  sweep?: number;
  label?: string;
  unit?: string;
  /** Color tone or specific color name. */
  tone?: 'accent' | 'success' | 'warning' | 'error';
  ariaLabel?: string;
}
