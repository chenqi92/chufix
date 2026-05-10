export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';

export interface GridProps {
  as?: string;
  columns?: number | string;
  minItemWidth?: number | string;
  gap?: GridGap;
  align?: GridAlign;
  justify?: GridJustify;
  dense?: boolean;
}

const gapMap = {
  none: '0',
  xs: 'var(--s-3)',
  sm: 'var(--s-5)',
  md: 'var(--s-6)',
  lg: 'var(--s-8)',
  xl: 'var(--s-10)',
};

export function gridClass(p: Required<Pick<GridProps, 'align' | 'justify'>> & Pick<GridProps, 'dense'>): string {
  return [
    'cf-grid',
    `cf-grid--align-${p.align}`,
    `cf-grid--justify-${p.justify}`,
    p.dense && 'cf-grid--dense',
  ].filter(Boolean).join(' ');
}

export function gridStyle(p: Pick<GridProps, 'columns' | 'minItemWidth' | 'gap'>): Record<string, string> {
  const style: Record<string, string> = {};
  if (typeof p.columns === 'number') style['--cf-grid-columns'] = `repeat(${p.columns}, minmax(0, 1fr))`;
  else if (p.columns) style['--cf-grid-columns'] = p.columns;
  if (typeof p.minItemWidth === 'number') style['--cf-grid-min'] = `${p.minItemWidth}px`;
  else if (p.minItemWidth) style['--cf-grid-min'] = p.minItemWidth;
  if (typeof p.gap === 'number') style['--cf-grid-gap'] = `${p.gap}px`;
  else if (typeof p.gap === 'string') style['--cf-grid-gap'] = gapMap[p.gap as keyof typeof gapMap] ?? p.gap;
  return style;
}
