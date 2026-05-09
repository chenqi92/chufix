export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  modelValue?: number;
  count?: number;
  allowHalf?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  size?: RatingSize;
  /** When provided, displays a label like "{value} / {count}". */
  showValue?: boolean;
}

export function ratingClass(p: {
  size: RatingSize;
  readonly: boolean;
  disabled: boolean;
}): string {
  return [
    'cf-rating',
    `cf-rating--${p.size}`,
    p.readonly && 'is-readonly',
    p.disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');
}
