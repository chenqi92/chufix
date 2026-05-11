import type { ButtonHTMLAttributes } from 'react';

export type ColorSwatchSize = 'sm' | 'md' | 'lg';
export type ColorSwatchShape = 'square' | 'round';

export interface ColorSwatchOwnProps {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  selected?: boolean;
  add?: boolean;
  label?: string;
}

export type ColorSwatchProps = ColorSwatchOwnProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ColorSwatchOwnProps | 'aria-label'
  > & { 'aria-label'?: string };

export const colorSwatchDefaults = {
  size: 'md' as ColorSwatchSize,
  shape: 'square' as ColorSwatchShape,
};

export function colorSwatchClass(p: {
  size: ColorSwatchSize;
  shape: ColorSwatchShape;
  selected?: boolean;
  add?: boolean;
  className?: string;
}): string {
  return [
    'cf-swatch',
    `cf-swatch--${p.size}`,
    p.shape === 'round' && 'cf-swatch--round',
    p.selected && 'cf-swatch--selected',
    p.add && 'cf-swatch--add',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
