export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdProps {
  keys?: string[];
  separator?: string;
  size?: KbdSize;
  className?: string;
  children?: import('react').ReactNode;
}

export function kbdClass(p: { size: KbdSize; className?: string }): string {
  return ['cf-kbd', `cf-kbd--${p.size}`, p.className].filter(Boolean).join(' ');
}
