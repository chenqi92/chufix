export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupSize = 'sm' | 'md' | 'lg';
export type ButtonGroupVariant = 'attached' | 'separated';

export interface ButtonGroupProps {
  /** Layout direction. */
  orientation?: ButtonGroupOrientation;
  /** Default size applied to descendant CfButton if they omit `size`. */
  size?: ButtonGroupSize;
  /** `attached`: shared border, inner radii collapse. `separated`: gap between buttons. */
  variant?: ButtonGroupVariant;
  /** Optional aria-label for the group landmark. */
  ariaLabel?: string;
}

export function buttonGroupClass(props: ButtonGroupProps): string {
  return [
    'cf-btn-group',
    `cf-btn-group--${props.orientation ?? 'horizontal'}`,
    `cf-btn-group--${props.variant ?? 'attached'}`,
    props.size ? `cf-btn-group--${props.size}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
