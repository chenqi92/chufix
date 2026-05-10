import type { CSSProperties, ElementType, HTMLAttributes } from 'react';

export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';
export type RowJustify = 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch';
export type RowGutter = number | string | [number | string, number | string];
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ColBreakpointConfig {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
  order?: number;
}

export type ColBreakpoint = number | ColBreakpointConfig;

export interface RowOwnProps {
  as?: ElementType;
  gutter?: RowGutter;
  justify?: RowJustify;
  align?: RowAlign;
  wrap?: boolean;
}

export type RowProps = RowOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof RowOwnProps>;

export interface ColOwnProps {
  as?: ElementType;
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
  order?: number;
  xs?: ColBreakpoint;
  sm?: ColBreakpoint;
  md?: ColBreakpoint;
  lg?: ColBreakpoint;
  xl?: ColBreakpoint;
  xxl?: ColBreakpoint;
}

export type ColProps = ColOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof ColOwnProps>;

export interface GridOwnProps {
  as?: ElementType;
  columns?: number | string;
  minItemWidth?: number | string;
  gap?: GridGap;
  align?: GridAlign;
  justify?: GridJustify;
  dense?: boolean;
}

export type GridProps = GridOwnProps & Omit<HTMLAttributes<HTMLElement>, keyof GridOwnProps>;

const gapMap = {
  none: '0',
  xs: 'var(--s-3)',
  sm: 'var(--s-5)',
  md: 'var(--s-6)',
  lg: 'var(--s-8)',
  xl: 'var(--s-10)',
};

export function gridClass(p: Required<Pick<GridOwnProps, 'align' | 'justify'>> & Pick<GridOwnProps, 'dense'> & { className?: string }): string {
  return [
    'cf-grid',
    `cf-grid--align-${p.align}`,
    `cf-grid--justify-${p.justify}`,
    p.dense && 'cf-grid--dense',
    p.className,
  ].filter(Boolean).join(' ');
}

export function gridStyle(p: Pick<GridOwnProps, 'columns' | 'minItemWidth' | 'gap'> & { style?: CSSProperties }): CSSProperties {
  const style = { ...p.style } as CSSProperties & Record<string, string>;
  if (typeof p.columns === 'number') style['--cf-grid-columns'] = `repeat(${p.columns}, minmax(0, 1fr))`;
  else if (p.columns) style['--cf-grid-columns'] = p.columns;
  if (typeof p.minItemWidth === 'number') style['--cf-grid-min'] = `${p.minItemWidth}px`;
  else if (p.minItemWidth) style['--cf-grid-min'] = p.minItemWidth;
  if (typeof p.gap === 'number') style['--cf-grid-gap'] = `${p.gap}px`;
  else if (typeof p.gap === 'string') style['--cf-grid-gap'] = gapMap[p.gap as keyof typeof gapMap] ?? p.gap;
  return style;
}

function cssSize(value: number | string | undefined): string {
  if (typeof value === 'number') return `${value}px`;
  return value ?? '0px';
}

function normalizeSpan(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(24, value));
}

function normalizeBreakpoint(value: ColBreakpoint | undefined): ColBreakpointConfig | undefined {
  if (typeof value === 'number') return { span: value };
  return value;
}

export function rowClass(p: Required<Pick<RowOwnProps, 'justify' | 'align' | 'wrap'>> & { className?: string }): string {
  return [
    'cf-row',
    `cf-row--justify-${p.justify}`,
    `cf-row--align-${p.align}`,
    !p.wrap && 'cf-row--nowrap',
    p.className,
  ].filter(Boolean).join(' ');
}

export function rowStyle(gutter: RowGutter, style?: CSSProperties): CSSProperties {
  const [x, y] = Array.isArray(gutter) ? gutter : [gutter, 0];
  return {
    ...style,
    '--cf-row-gutter-x': cssSize(x),
    '--cf-row-gutter-y': cssSize(y),
  } as CSSProperties;
}

export function colClass(p: ColOwnProps & { className?: string }): string {
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  return [
    'cf-col',
    ...breakpoints.map((key) => (p[key] == null ? '' : `cf-col--${key}`)),
    p.className,
  ].filter(Boolean).join(' ');
}

export function colStyle(p: ColOwnProps & { style?: CSSProperties }): CSSProperties {
  const style = {
    ...p.style,
    '--cf-col-span': String(normalizeSpan(p.span, 24)),
    '--cf-col-offset': String(normalizeSpan(p.offset, 0)),
    '--cf-col-push': String(normalizeSpan(p.push, 0)),
    '--cf-col-pull': String(normalizeSpan(p.pull, 0)),
  } as CSSProperties & Record<string, string>;
  if (typeof p.order === 'number') style['--cf-col-order'] = String(p.order);

  (['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[]).forEach((key) => {
    const cfg = normalizeBreakpoint(p[key]);
    if (!cfg) return;
    style[`--cf-col-${key}-span`] = String(normalizeSpan(cfg.span, p.span ?? 24));
    style[`--cf-col-${key}-offset`] = String(normalizeSpan(cfg.offset, p.offset ?? 0));
    style[`--cf-col-${key}-push`] = String(normalizeSpan(cfg.push, p.push ?? 0));
    style[`--cf-col-${key}-pull`] = String(normalizeSpan(cfg.pull, p.pull ?? 0));
    if (typeof cfg.order === 'number') style[`--cf-col-${key}-order`] = String(cfg.order);
  });

  return style;
}
