export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  self?: boolean;
  away?: boolean;
}

const PALETTE = [
  'oklch(68% 0.16 263)',
  'oklch(72% 0.14 78)',
  'oklch(70% 0.15 152)',
  'oklch(70% 0.18 22)',
  'oklch(70% 0.13 195)',
  'oklch(70% 0.16 320)',
  'oklch(74% 0.14 110)',
  'oklch(70% 0.1 230)',
];

export function colorForUser(user: PresenceUser): string {
  if (user.color) return user.color;
  let h = 0;
  for (let i = 0; i < user.id.length; i++) h = (h * 31 + user.id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
