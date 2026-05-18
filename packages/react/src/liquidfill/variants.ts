export interface LiquidFillProps {
  value: number;
  width?: number;
  height?: number;
  amplitude?: number;
  wavelength?: number;
  speed?: number;
  waves?: number;
  shape?: 'circle' | 'rect';
  label?: string;
  ariaLabel?: string;
  className?: string;
}
