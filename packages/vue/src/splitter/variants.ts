export type SplitterOrientation = 'horizontal' | 'vertical';
export type SplitterUnit = '%' | 'px';

export interface SplitterProps {
  modelValue?: number;
  defaultSize?: number;
  unit?: SplitterUnit;
  orientation?: SplitterOrientation;
  min?: number;
  max?: number;
  disabled?: boolean;
  collapsible?: boolean;
  /** Which pane (`'start'` or `'end'`) the size value applies to. */
  resizeFrom?: 'start' | 'end';
}

export function splitterClass(p: {
  orientation: SplitterOrientation;
  disabled: boolean;
  dragging: boolean;
}): string {
  return [
    'cf-splitter',
    `cf-splitter--${p.orientation}`,
    p.disabled && 'is-disabled',
    p.dragging && 'is-dragging',
  ]
    .filter(Boolean)
    .join(' ');
}
