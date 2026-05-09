export type IconButtonVariant = 'default' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'square' | 'round';

export interface IconButtonProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  pressed?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const defaultIconButtonProps: Required<IconButtonProps> = {
  variant: 'default',
  size: 'md',
  shape: 'square',
  pressed: false,
  loading: false,
  disabled: false,
  type: 'button',
};

export function iconButtonClass(p: IconButtonProps): string {
  const m = { ...defaultIconButtonProps, ...p };
  return [
    'cf-iconbtn',
    `cf-iconbtn--${m.variant}`,
    `cf-iconbtn--${m.size}`,
    m.shape === 'round' && 'cf-iconbtn--round',
    m.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}
