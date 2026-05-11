import type { ReactNode } from 'react';

export type StatusBarTone =
  | 'default'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type StatusBarSize = 'sm' | 'md';

export interface StatusBarItem {
  id: string;
  label: ReactNode;
  tone?: StatusBarTone;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
}

export interface StatusBarProps {
  size?: StatusBarSize;
  tone?: StatusBarTone;
  leftItems?: StatusBarItem[];
  centerItems?: StatusBarItem[];
  rightItems?: StatusBarItem[];
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  onItemClick?: (id: string, item: StatusBarItem) => void;
  className?: string;
}
