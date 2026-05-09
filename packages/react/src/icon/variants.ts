import type { CSSProperties, SVGAttributes } from 'react';
import type { IconName } from '@chufix/icons';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
export type IconStrokeWidth = 1 | 1.25 | 1.5 | 1.75 | 2 | number;
export type IconMotion = 'spin' | 'pulse' | 'bounce';

export interface IconOwnProps {
  name: IconName;
  size?: IconSize;
  strokeWidth?: IconStrokeWidth;
  color?: string;
  motion?: IconMotion;
  title?: string;
}

export type IconProps = IconOwnProps &
  Omit<SVGAttributes<SVGSVGElement>, keyof IconOwnProps | 'children'>;

export function iconClass(p: { size: IconSize; motion?: IconMotion; className?: string }): string {
  return [
    'cf-icon',
    typeof p.size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(p.size) && `cf-icon--${p.size}`,
    p.motion && `cf-icon--motion-${p.motion}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function iconStyle(size: IconSize, color?: string, style?: CSSProperties): CSSProperties | undefined {
  const isPresetSize = typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size);

  if (isPresetSize && !color) {
    return style;
  }

  const nextStyle = { ...style } as CSSProperties & Record<string, string>;

  if (!isPresetSize) {
    const value = typeof size === 'number' ? `${size}px` : size;
    nextStyle['--cf-icon-size'] = value;
  }

  if (color) {
    nextStyle.color = color;
  }

  return nextStyle;
}
