export interface ChartCrosshairProps {
  /** Show / hide the crosshair (typically toggled on mouseenter / leave). */
  visible?: boolean;
  /** Pixel x coordinate inside the chart's coordinate space. */
  x?: number;
  /** Pixel y coordinate. */
  y?: number;
  /** Total width / height of the parent SVG. */
  width: number;
  height: number;
  /** Show vertical line. */
  showVertical?: boolean;
  /** Show horizontal line. */
  showHorizontal?: boolean;
  /** Optional tooltip label rendered near the crosshair. */
  tooltip?: string;
}
