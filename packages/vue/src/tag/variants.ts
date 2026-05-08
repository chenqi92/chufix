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
    'cf-tag',
    `cf-tag--${p.variant}`,
    `cf-tag--${p.size}`,
    `cf-tag--${p.tone}`,
    p.rounded && 'cf-tag--rounded',
  ]
    .filter(Boolean)
    .join(' ');
}
