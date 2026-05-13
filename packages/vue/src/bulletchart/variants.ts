export interface BulletChartProps {
  /** Current measured value. */
  value: number;
  /** Target marker value. */
  target?: number;
  /** Range max. */
  max: number;
  /** Optional qualitative bands [poor, ok, good]. */
  bands?: { upTo: number; tone?: 'error' | 'warning' | 'success' }[];
  width?: number;
  height?: number;
  label?: string;
  ariaLabel?: string;
}

export interface BulletChartInteractionPayload {
  value: number;
  target?: number;
  max: number;
  nativeEvent?: MouseEvent | PointerEvent;
}
