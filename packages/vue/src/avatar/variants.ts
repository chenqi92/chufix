export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  fallback?: string;
}

export function avatarClass(p: {
  size: AvatarSize;
  shape: AvatarShape;
}): string {
  return ['ck-avatar', `ck-avatar--${p.size}`, `ck-avatar--${p.shape}`].join(' ');
}

export function initialsFromName(name?: string, fallback?: string): string {
  if (fallback) return fallback;
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface AvatarGroupProps {
  size?: AvatarSize;
  shape?: AvatarShape;
  spacing?: number;
  max?: number;
}
