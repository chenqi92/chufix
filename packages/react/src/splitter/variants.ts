export type SplitterOrientation = 'horizontal' | 'vertical';
export type SplitterUnit = '%' | 'px';

export interface SplitterProps {
  value?: number;
  defaultValue?: number;
  unit?: SplitterUnit;
  orientation?: SplitterOrientation;
  min?: number;
  max?: number;
  disabled?: boolean;
  collapsible?: boolean;
  resizeFrom?: 'start' | 'end';
  start?: import('react').ReactNode;
  end?: import('react').ReactNode;
  className?: string;
  onChange?: (value: number) => void;
  onResize?: (value: number) => void;
}

export function splitterClass(p: {
  orientation: SplitterOrientation;
  disabled: boolean;
  dragging: boolean;
  className?: string;
}): string {
  return [
    'cf-splitter',
    `cf-splitter--${p.orientation}`,
    p.disabled && 'is-disabled',
    p.dragging && 'is-dragging',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
