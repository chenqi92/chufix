export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  /** label position when orientation=horizontal and a label slot is provided. */
  align?: 'start' | 'center' | 'end';
}

export function dividerClass(p: {
  orientation: DividerOrientation;
  variant: DividerVariant;
  align: 'start' | 'center' | 'end';
  hasLabel: boolean;
}): string {
  return [
    'cf-divider',
    `cf-divider--${p.orientation}`,
    `cf-divider--${p.variant}`,
    p.hasLabel && `cf-divider--has-label cf-divider--align-${p.align}`,
  ]
    .filter(Boolean)
    .join(' ');
}
