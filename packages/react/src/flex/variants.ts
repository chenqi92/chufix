import type { CSSProperties, ElementType, HTMLAttributes } from 'react';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

export interface FlexOwnProps {
  as?: ElementType;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  gap?: FlexGap;
  wrap?: boolean;
  inline?: boolean;
  full?: boolean;
}

export type FlexProps = FlexOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof FlexOwnProps>;

const gapMap = {
  none: '0',
  xs: 'var(--s-3)',
  sm: 'var(--s-5)',
  md: 'var(--s-6)',
  lg: 'var(--s-8)',
  xl: 'var(--s-10)',
};

export function flexClass(p: Required<Pick<FlexOwnProps, 'direction' | 'align' | 'justify'>> & Pick<FlexOwnProps, 'wrap' | 'inline' | 'full'> & { className?: string }): string {
  return [
    'cf-flex',
    `cf-flex--dir-${p.direction}`,
    `cf-flex--align-${p.align}`,
    `cf-flex--justify-${p.justify}`,
    p.wrap && 'cf-flex--wrap',
    p.inline && 'cf-flex--inline',
    p.full && 'cf-flex--full',
    p.className,
  ].filter(Boolean).join(' ');
}

export function flexStyle(gap: FlexGap, style?: CSSProperties): CSSProperties {
  const next = { ...style } as CSSProperties & Record<string, string>;
  if (typeof gap === 'number') next['--cf-flex-gap'] = `${gap}px`;
  else next['--cf-flex-gap'] = gapMap[gap as keyof typeof gapMap] ?? gap;
  return next;
}
