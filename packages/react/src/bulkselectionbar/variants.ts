import type { ReactNode } from 'react';

export type BulkBarPosition = 'sticky-top' | 'sticky-bottom' | 'inline';

export interface BulkSelectionBarProps {
  count: number;
  total?: number;
  hideWhenEmpty?: boolean;
  position?: BulkBarPosition;
  label?: string;
  showClear?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  children?: ReactNode;
}
