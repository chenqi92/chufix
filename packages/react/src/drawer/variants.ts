import type { ReactNode } from 'react';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
  container?: HTMLElement | null;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}
