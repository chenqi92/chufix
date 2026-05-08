export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type BadgePlacement =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  content?: string | number;
  max?: number;
  showZero?: boolean;
  placement?: BadgePlacement;
  offset?: [number, number];
}

export function badgeRootClass(p: { wrap: boolean }): string {
  return p.wrap ? 'cf-badge-wrap' : 'cf-badge-inline';
}

export function badgeClass(p: {
  tone: BadgeTone;
  dot: boolean;
  placement: BadgePlacement;
  wrap: boolean;
}): string {
  return [
    'cf-badge',
    `cf-badge--${p.tone}`,
    p.dot && 'cf-badge--dot',
    p.wrap && `cf-badge--placed cf-badge--${p.placement}`,
  ]
    .filter(Boolean)
    .join(' ');
}

export function formatBadgeContent(
  content: string | number | undefined,
  max: number,
): string | undefined {
  if (content == null) return undefined;
  if (typeof content === 'string') return content;
  if (max > 0 && content > max) return `${max}+`;
  return String(content);
}
