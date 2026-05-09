import type { IconName } from '@chufix/icons';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
export type IconStrokeWidth = 1 | 1.25 | 1.5 | 1.75 | 2 | number;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  strokeWidth?: IconStrokeWidth;
  title?: string;
  label?: string;
}

export function iconClass(size: IconSize): string {
  return [
    'cf-icon',
    typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size) && `cf-icon--${size}`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function iconStyle(size: IconSize): Record<string, string> | undefined {
  if (typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size)) {
    return undefined;
  }

  return {
    '--cf-icon-size': typeof size === 'number' ? `${size}px` : size,
  };
}
