import type { ReactNode } from 'react';

export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
export type SpeedDialTrigger = 'click' | 'hover';
export type SpeedDialLabelMode = 'hover' | 'always' | 'never';

export interface SpeedDialAction {
  key: string;
  iconPath?: string;
  /** Custom icon node (takes precedence over iconPath). */
  icon?: ReactNode;
  label?: string;
  disabled?: boolean;
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  direction?: SpeedDialDirection;
  position?: SpeedDialPosition;
  trigger?: SpeedDialTrigger;
  showLabels?: SpeedDialLabelMode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (key: string, action: SpeedDialAction) => void;
  ariaLabel?: string;
  /** Custom trigger icon (replaces default + icon). */
  triggerIcon?: ReactNode;
}
