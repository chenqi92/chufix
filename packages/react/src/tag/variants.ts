import type { HTMLAttributes, ReactNode, MouseEvent } from 'react';

export type TagVariant = 'solid' | 'soft' | 'outline';
export type TagSize = 'sm' | 'md' | 'lg';
export type TagTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface TagOwnProps {
  variant?: TagVariant;
  size?: TagSize;
  tone?: TagTone;
  closable?: boolean;
  rounded?: boolean;
  leading?: ReactNode;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export type TagProps = TagOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof TagOwnProps>;

export function tagClass(p: {
  variant: TagVariant;
  size: TagSize;
  tone: TagTone;
  rounded: boolean;
  className?: string;
}): string {
  return [
    'ck-tag',
    `ck-tag--${p.variant}`,
    `ck-tag--${p.size}`,
    `ck-tag--${p.tone}`,
    p.rounded && 'ck-tag--rounded',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
