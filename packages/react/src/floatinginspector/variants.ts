import type { ReactNode } from 'react';

export type InspectorPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface FloatingInspectorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  title?: ReactNode;
  placement?: InspectorPlacement;
  width?: number | string;
  offset?: number;
  closable?: boolean;
  container?: HTMLElement | null;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}
