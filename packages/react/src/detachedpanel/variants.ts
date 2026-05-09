import type { ReactNode } from 'react';

export interface DetachedPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  resizable?: boolean;
  closable?: boolean;
  container?: HTMLElement | null;
  zIndex?: number;
  actions?: ReactNode;
  children?: ReactNode;
  onMove?: (x: number, y: number) => void;
  className?: string;
}
