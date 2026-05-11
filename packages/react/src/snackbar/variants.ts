import type { ReactNode } from 'react';

export type SnackbarTone =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type SnackbarPlacement =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right';

export interface SnackbarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: ReactNode;
  tone?: SnackbarTone;
  placement?: SnackbarPlacement;
  duration?: number;
  actionLabel?: ReactNode;
  actionShortcut?: string;
  showDismiss?: boolean;
  container?: HTMLElement | null;
  onAction?: () => void;
  onDismiss?: () => void;
  children?: ReactNode;
}

export function snackbarClass(p: {
  tone: SnackbarTone;
  placement: SnackbarPlacement;
}): string {
  return [
    'cf-snackbar',
    `cf-snackbar--${p.tone}`,
    `cf-snackbar--${p.placement}`,
  ].join(' ');
}
