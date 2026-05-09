import type { HTMLAttributes } from 'react';

export type ToolbarVariant = 'default' | 'plain';
export type ToolbarSize = 'sm' | 'md' | 'lg';
export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface ToolbarOwnProps {
  variant?: ToolbarVariant;
  size?: ToolbarSize;
  orientation?: ToolbarOrientation;
}

export type ToolbarProps = ToolbarOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ToolbarOwnProps>;

export const toolbarDefaults = {
  variant: 'default' as ToolbarVariant,
  size: 'md' as ToolbarSize,
  orientation: 'horizontal' as ToolbarOrientation,
};

export function toolbarClass(p: {
  variant: ToolbarVariant;
  size: ToolbarSize;
  orientation: ToolbarOrientation;
  className?: string;
}): string {
  return [
    'cf-toolbar',
    `cf-toolbar--${p.variant}`,
    `cf-toolbar--${p.size}`,
    `cf-toolbar--${p.orientation}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
