import type { IconName } from '@chufix/icons';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
export type IconStrokeWidth = 1 | 1.25 | 1.5 | 1.75 | 2 | number;
export type IconMotion = 'spin' | 'pulse' | 'bounce';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  strokeWidth?: IconStrokeWidth;
  color?: string;
  motion?: IconMotion;
  title?: string;
  label?: string;
}

export function iconClass(size: IconSize, motion?: IconMotion): string {
  return [
    'cf-icon',
    typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size) && `cf-icon--${size}`,
    motion && `cf-icon--motion-${motion}`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function iconStyle(size: IconSize, color?: string): Record<string, string> | undefined {
  const isPresetSize = typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size);

  if (isPresetSize && !color) {
    return undefined;
  }

  const style: Record<string, string> = {};

  if (!isPresetSize) {
    style['--cf-icon-size'] = typeof size === 'number' ? `${size}px` : size;
  }

  if (color) {
    style.color = color;
  }

  return style;
}
