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
}

export function linkClass(p: {
  variant: LinkVariant;
  size: LinkSize;
  disabled: boolean;
}): string {
  return [
    'cf-link',
    `cf-link--${p.variant}`,
    `cf-link--${p.size}`,
    p.disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');
}
