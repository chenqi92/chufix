import type { CSSProperties, ReactNode } from 'react';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupSize = 'sm' | 'md' | 'lg';
export type ButtonGroupVariant = 'attached' | 'separated';

export interface ButtonGroupProps {
  orientation?: ButtonGroupOrientation;
  size?: ButtonGroupSize;
  variant?: ButtonGroupVariant;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function buttonGroupClass(props: ButtonGroupProps): string {
  return [
    'cf-btn-group',
    `cf-btn-group--${props.orientation ?? 'horizontal'}`,
    `cf-btn-group--${props.variant ?? 'attached'}`,
    props.size ? `cf-btn-group--${props.size}` : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' ');
}
