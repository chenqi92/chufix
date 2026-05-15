export interface RemoteCursorItem {
  id: string;
  x: number;
  y: number;
  name?: string;
  color?: string;
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

export function colorForCursor(cursor: RemoteCursorItem): string {
  if (cursor.color) return cursor.color;
  let h = 0;
  for (let i = 0; i < cursor.id.length; i++) h = (h * 31 + cursor.id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
