import type { ReactNode } from 'react';

export type FieldRowLayout = 'vertical' | 'horizontal';
export type FieldRowSize = 'sm' | 'md' | 'lg';

export interface FieldRowProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  layout?: FieldRowLayout;
  size?: FieldRowSize;
  extraLabel?: string;
  children?: ReactNode;
}
