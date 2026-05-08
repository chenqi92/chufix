export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill' | 'square';
export type ButtonTone = 'primary' | 'danger';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  tone?: ButtonTone;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const defaultButtonProps: Required<Omit<ButtonProps, 'type'>> & { type: 'button' } = {
  variant: 'solid',
  size: 'md',
  shape: 'default',
  tone: 'primary',
  disabled: false,
  loading: false,
  block: false,
  type: 'button',
};

export function buttonClass(props: ButtonProps): string {
  const p = { ...defaultButtonProps, ...props };
  return [
    'cf-btn',
    `cf-btn--${p.variant}`,
    `cf-btn--${p.size}`,
    `cf-btn--${p.tone}`,
    p.shape !== 'default' && `cf-btn--${p.shape}`,
    p.block && 'cf-btn--block',
    p.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}
