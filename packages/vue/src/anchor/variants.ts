export interface AnchorItem {
  href: string;
  label: string;
  children?: AnchorItem[];
}

export interface AnchorProps {
  items: AnchorItem[];
  offsetTop?: number;
  bounds?: number;
  target?: string;
  className?: string;
}

export function anchorClass(p: { className?: string }): string {
  return ['cf-anchor', p.className].filter(Boolean).join(' ');
}
