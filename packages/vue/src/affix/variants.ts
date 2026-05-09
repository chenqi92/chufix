export interface AffixProps {
  offsetTop?: number;
  offsetBottom?: number;
  target?: string;
  zIndex?: number;
  className?: string;
}

export function affixClass(p: { fixed: boolean; className?: string }): string {
  return [
    'cf-affix',
    p.fixed && 'is-fixed',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
