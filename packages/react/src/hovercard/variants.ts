import type { ReactNode } from 'react';

export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';
export type HoverCardSize = 'sm' | 'md' | 'lg';

export interface HoverCardProps {
  placement?: HoverCardPlacement;
  size?: HoverCardSize;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  container?: HTMLElement | null;
  trigger: ReactNode;
  children?: ReactNode;
}
