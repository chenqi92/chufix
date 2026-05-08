import type { TextareaHTMLAttributes } from 'react';

export type TextareaVariant = 'outline' | 'filled' | 'ghost';
export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaOwnProps {
  variant?: TextareaVariant;
  size?: TextareaSize;
  error?: boolean;
  resize?: TextareaResize;
  autoResize?: boolean;
  showCount?: boolean;
}

export type TextareaProps = TextareaOwnProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextareaOwnProps | 'size'>;

export function textareaClass(p: {
  variant: TextareaVariant;
  size: TextareaSize;
  focused: boolean;
  disabled: boolean;
  error: boolean;
  className?: string;
}): string {
  return [
    'cf-textarea',
    `cf-textarea--${p.variant}`,
    `cf-textarea--${p.size}`,
    p.focused && 'is-focused',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
