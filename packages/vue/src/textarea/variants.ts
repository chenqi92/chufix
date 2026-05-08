export type TextareaVariant = 'outline' | 'filled' | 'ghost';
export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps {
  modelValue?: string;
  variant?: TextareaVariant;
  size?: TextareaSize;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  resize?: TextareaResize;
  autoResize?: boolean;
  maxlength?: number;
  showCount?: boolean;
  name?: string;
  id?: string;
}

export function textareaClass(p: {
  variant: TextareaVariant;
  size: TextareaSize;
  focused: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'ck-textarea',
    `ck-textarea--${p.variant}`,
    `ck-textarea--${p.size}`,
    p.focused && 'is-focused',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}
