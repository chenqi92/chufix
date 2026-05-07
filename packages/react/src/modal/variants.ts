import type { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
  /** Custom DOM node to portal into. Defaults to document.body. */
  container?: HTMLElement | null;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}
