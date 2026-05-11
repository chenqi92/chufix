export type ToolbarVariant = 'default' | 'plain';
export type ToolbarSize = 'sm' | 'md' | 'lg';
export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface ToolbarProps {
  variant?: ToolbarVariant;
  size?: ToolbarSize;
  orientation?: ToolbarOrientation;
}

export const defaultToolbarProps: Required<ToolbarProps> = {
  variant: 'default',
  size: 'md',
  orientation: 'horizontal',
};

export function toolbarClass(p: ToolbarProps): string {
  const m = { ...defaultToolbarProps, ...p };
  return [
    'cf-toolbar',
    `cf-toolbar--${m.variant}`,
    `cf-toolbar--${m.size}`,
    `cf-toolbar--${m.orientation}`,
  ].join(' ');
}
