export interface LiquidFillProps {
  /** Fill percentage 0..1 */
  value: number;
  width?: number;
  height?: number;
  /** Wave amplitude in svg units. */
  amplitude?: number;
  /** Wave wavelength as fraction of container width. */
  wavelength?: number;
  /** Animation speed in cycles per second (0 disables). */
  speed?: number;
  /** Number of wave layers (1-3). */
  waves?: number;
  /** Shape: circle (default) or rect. */
  shape?: 'circle' | 'rect';
  /** Center text. Falls back to percentage. */
  label?: string;
  ariaLabel?: string;
}
