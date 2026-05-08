export type TagVariant = 'solid' | 'soft' | 'outline';
export type TagSize = 'sm' | 'md' | 'lg';
export type TagTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface TagProps {
  variant?: TagVariant;
  size?: TagSize;
  tone?: TagTone;
  closable?: boolean;
  rounded?: boolean;
}

export function tagClass(p: {
  variant: TagVariant;
  size: TagSize;
  tone: TagTone;
  rounded: boolean;
}): string {
  return [
    'ck-tag',
    `ck-tag--${p.variant}`,
    `ck-tag--${p.size}`,
    `ck-tag--${p.tone}`,
    p.rounded && 'ck-tag--rounded',
  ]
    .filter(Boolean)
    .join(' ');
}
