export type ConfirmTone = 'default' | 'danger';

export interface ConfirmDialogProps {
  open?: boolean;
  title?: string;
  description?: string;
  tone?: ConfirmTone;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}
