import type { CSSProperties, SVGAttributes } from 'react';
import type { IconName } from '@chufix/icons';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
export type IconStrokeWidth = 1 | 1.25 | 1.5 | 1.75 | 2 | number;

export interface IconOwnProps {
  name: IconName;
  size?: IconSize;
  strokeWidth?: IconStrokeWidth;
  title?: string;
}

export type IconProps = IconOwnProps &
  Omit<SVGAttributes<SVGSVGElement>, keyof IconOwnProps | 'children'>;

export function iconClass(p: { size: IconSize; className?: string }): string {
  return [
    'cf-icon',
    typeof p.size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(p.size) && `cf-icon--${p.size}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function iconStyle(size: IconSize, style?: CSSProperties): CSSProperties | undefined {
  if (typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size)) {
    return style;
  }

  const value = typeof size === 'number' ? `${size}px` : size;
  return { ...style, '--cf-icon-size': value } as CSSProperties;
}
