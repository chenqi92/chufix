import type { ReactNode } from 'react';

export type TitleBarPlatform = 'macos' | 'windows' | 'linux';
export type TitleBarSize = 'sm' | 'md' | 'lg';

export interface TitleBarProps {
  platform?: TitleBarPlatform;
  title?: string;
  subtitle?: string;
  modified?: boolean;
  size?: TitleBarSize;
  hideControls?: boolean;
  leading?: ReactNode;
  actions?: ReactNode;
  titleSlot?: ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}
