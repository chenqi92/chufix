import type { ReactNode } from 'react';

export type SwipeActionTone =
  | 'default'
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

export interface SwipeActionItem {
  key: string;
  label: string;
  tone?: SwipeActionTone;
  onClick?: () => void;
}

export interface SwipeActionProps {
  left?: SwipeActionItem[];
  right?: SwipeActionItem[];
  threshold?: number;
  closeOnOutsideTap?: boolean;
  disabled?: boolean;
  onAction?: (key: string, item: SwipeActionItem) => void;
  onOpen?: (side: 'left' | 'right') => void;
  onClose?: () => void;
  children?: ReactNode;
}
