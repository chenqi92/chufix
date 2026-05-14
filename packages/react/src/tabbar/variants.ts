import type { ReactNode } from 'react';

export type TabBarVariant = 'line' | 'fill';

export interface TabBarItem {
  key: string;
  label?: string;
  iconPath?: string;
  /** Custom icon node (takes precedence over `iconPath`). */
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabBarProps {
  items: TabBarItem[];
  value?: string;
  onChange?: (key: string, item: TabBarItem) => void;
  fixed?: boolean;
  safeArea?: boolean;
  variant?: TabBarVariant;
  ariaLabel?: string;
}
