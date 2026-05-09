export type InspectorPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface FloatingInspectorProps {
  open?: boolean;
  title?: string;
  placement?: InspectorPlacement;
  collapsed?: boolean;
  width?: number | string;
  /** Outer offset from viewport edge in px. Default 24. */
  offset?: number;
  closable?: boolean;
  to?: string;
}
