export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdProps {
  keys?: string[];
  separator?: string;
  size?: KbdSize;
}

export function kbdClass(p: { size: KbdSize }): string {
  return ['cf-kbd', `cf-kbd--${p.size}`].join(' ');
}
