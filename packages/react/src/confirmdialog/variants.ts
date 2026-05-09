import type { ReactNode } from 'react';

export type ConfirmTone = 'default' | 'danger';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  tone?: ConfirmTone;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  loading?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}
