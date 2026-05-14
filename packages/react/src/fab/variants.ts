import type { MouseEvent, ReactNode } from 'react';

export type FabSize = 'sm' | 'md' | 'lg';
export type FabVariant = 'primary' | 'secondary' | 'tertiary';
export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface FabProps {
  icon?: ReactNode;
  label?: string;
  extended?: boolean;
  size?: FabSize;
  variant?: FabVariant;
  position?: FabPosition;
  hideOnScroll?: boolean;
  badge?: number | string;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}
