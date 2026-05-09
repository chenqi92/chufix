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
  open?: boolean;
  message?: string;
  tone?: SnackbarTone;
  placement?: SnackbarPlacement;
  /** Auto-close in ms; 0 disables. Default 5000. */
  duration?: number;
  /** Optional action button label (e.g. "Undo"). */
  actionLabel?: string;
  /** Optional shortcut hint shown next to action. */
  actionShortcut?: string;
  showDismiss?: boolean;
  /** Where to teleport. Defaults to body. */
  to?: string;
}

export function snackbarClass(p: { tone: SnackbarTone; placement: SnackbarPlacement }): string {
  return [
    'cf-snackbar',
    `cf-snackbar--${p.tone}`,
    `cf-snackbar--${p.placement}`,
  ].join(' ');
}
