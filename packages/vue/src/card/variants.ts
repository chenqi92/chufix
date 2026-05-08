export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  variant?: CardVariant;
  interactive?: boolean;
  as?: string;
}

export function cardClass(p: { variant: CardVariant; interactive: boolean }): string {
  return [
    'cf-card',
    `cf-card--${p.variant}`,
    p.interactive && 'is-interactive',
  ]
    .filter(Boolean)
    .join(' ');
}
