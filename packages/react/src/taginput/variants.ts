export type TagInputVariant = 'outline' | 'filled' | 'ghost';
export type TagInputSize = 'sm' | 'md' | 'lg';
export type TagInputTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  variant?: TagInputVariant;
  size?: TagInputSize;
  tone?: TagInputTone;
  disabled?: boolean;
  error?: boolean;
  max?: number;
  separators?: string[];
  unique?: boolean;
  trim?: boolean;
  validate?: (tag: string) => boolean;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (value: string[]) => void;
  onAdd?: (tag: string) => void;
  onRemove?: (tag: string, index: number) => void;
}

export function tagInputClass(p: {
  variant: TagInputVariant;
  size: TagInputSize;
  disabled: boolean;
  error: boolean;
  focused: boolean;
  className?: string;
}): string {
  return [
    'cf-taginput',
    `cf-taginput--${p.variant}`,
    `cf-taginput--${p.size}`,
    p.disabled && 'is-disabled',
    p.error && 'is-error',
    p.focused && 'is-focused',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
