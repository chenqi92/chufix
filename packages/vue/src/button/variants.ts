export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill' | 'square';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const defaultButtonProps: Required<Omit<ButtonProps, 'type'>> & {
  type: 'button';
} = {
  variant: 'primary',
  size: 'md',
  shape: 'default',
  disabled: false,
  loading: false,
  block: false,
  type: 'button',
};

export function buttonClass(props: ButtonProps): string {
  const p = { ...defaultButtonProps, ...props };
  return [
    'ck-btn',
    `ck-btn--${p.variant}`,
    `ck-btn--${p.size}`,
    p.shape !== 'default' && `ck-btn--${p.shape}`,
    p.block && 'ck-btn--block',
    p.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}
