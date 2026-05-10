export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

export interface FlexProps {
  as?: string;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: FlexGap;
  wrap?: boolean;
  inline?: boolean;
  full?: boolean;
}

const gapMap = {
  none: '0',
  xs: 'var(--s-3)',
  sm: 'var(--s-5)',
  md: 'var(--s-6)',
  lg: 'var(--s-8)',
  xl: 'var(--s-10)',
};

export function flexClass(p: Required<Pick<FlexProps, 'direction' | 'align' | 'justify'>> & Pick<FlexProps, 'wrap' | 'inline' | 'full'>): string {
  return [
    'cf-flex',
    `cf-flex--dir-${p.direction}`,
    `cf-flex--align-${p.align}`,
    `cf-flex--justify-${p.justify}`,
    p.wrap && 'cf-flex--wrap',
    p.inline && 'cf-flex--inline',
    p.full && 'cf-flex--full',
  ].filter(Boolean).join(' ');
}

export function flexStyle(gap: FlexGap): Record<string, string> | undefined {
  if (typeof gap === 'number') return { '--cf-flex-gap': `${gap}px` };
  if (typeof gap === 'string') return { '--cf-flex-gap': gapMap[gap as keyof typeof gapMap] ?? gap };
  return undefined;
}
