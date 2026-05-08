import type { ReactNode, CSSProperties } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  fallback?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AvatarGroupProps {
  size?: AvatarSize;
  shape?: AvatarShape;
  spacing?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function avatarClass(p: {
  size: AvatarSize;
  shape: AvatarShape;
  className?: string;
}): string {
  return ['cf-avatar', `cf-avatar--${p.size}`, `cf-avatar--${p.shape}`, p.className]
    .filter(Boolean)
    .join(' ');
}

export function initialsFromName(name?: string, fallback?: string): string {
  if (fallback) return fallback;
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
