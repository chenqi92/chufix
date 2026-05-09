export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowHalf?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  size?: RatingSize;
  showValue?: boolean;
  className?: string;
  onChange?: (value: number) => void;
}

export function ratingClass(p: {
  size: RatingSize;
  readonly: boolean;
  disabled: boolean;
  className?: string;
}): string {
  return [
    'cf-rating',
    `cf-rating--${p.size}`,
    p.readonly && 'is-readonly',
    p.disabled && 'is-disabled',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
