export type ColorSwatchSize = 'sm' | 'md' | 'lg';
export type ColorSwatchShape = 'square' | 'round';

export interface ColorSwatchProps {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  selected?: boolean;
  disabled?: boolean;
  add?: boolean;
  label?: string;
}

export const defaultColorSwatchProps: Required<Omit<ColorSwatchProps, 'color' | 'label'>> = {
  size: 'md',
  shape: 'square',
  selected: false,
  disabled: false,
  add: false,
};

export function colorSwatchClass(p: ColorSwatchProps): string {
  const m = { ...defaultColorSwatchProps, ...p };
  return [
    'cf-swatch',
    `cf-swatch--${m.size}`,
    m.shape === 'round' && 'cf-swatch--round',
    m.selected && 'cf-swatch--selected',
    m.add && 'cf-swatch--add',
  ]
    .filter(Boolean)
    .join(' ');
}
