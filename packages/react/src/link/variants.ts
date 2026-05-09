export type LinkVariant = 'default' | 'subtle' | 'inverse' | 'underline';
export type LinkSize = 'sm' | 'md' | 'lg';

export interface LinkProps {
  href?: string;
  target?: string;
  rel?: string;
  external?: boolean;
  variant?: LinkVariant;
  size?: LinkSize;
  disabled?: boolean;
  className?: string;
  children?: import('react').ReactNode;
  onClick?: import('react').MouseEventHandler<HTMLAnchorElement>;
}

export function linkClass(p: {
  variant: LinkVariant;
  size: LinkSize;
  disabled: boolean;
  className?: string;
}): string {
  return [
    'cf-link',
    `cf-link--${p.variant}`,
    `cf-link--${p.size}`,
    p.disabled && 'is-disabled',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
