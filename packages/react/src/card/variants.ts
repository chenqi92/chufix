import type { HTMLAttributes } from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardOwnProps {
  variant?: CardVariant;
  interactive?: boolean;
}

export type CardProps = CardOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof CardOwnProps>;

export function cardClass(p: {
  variant: CardVariant;
  interactive: boolean;
  className?: string;
}): string {
  return [
    'ck-card',
    `ck-card--${p.variant}`,
    p.interactive && 'is-interactive',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
