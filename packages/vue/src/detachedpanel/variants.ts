export interface DetachedPanelProps {
  open?: boolean;
  title?: string;
  /** Initial position. Defaults: top-right corner. */
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  resizable?: boolean;
  closable?: boolean;
  to?: string;
  /** z-index override */
  zIndex?: number;
}
