import type { ReactNode } from 'react';

export type MarqueeDirection = 'left' | 'right';

export interface MarqueeProps {
  content?: string;
  children?: ReactNode;
  duration?: number;
  direction?: MarqueeDirection;
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
}

export function marqueeClass(p: {
  direction: MarqueeDirection;
  pauseOnHover: boolean;
  className?: string;
}): string {
  return [
    'cf-marquee',
    `cf-marquee--${p.direction}`,
    p.pauseOnHover && 'cf-marquee--pause-on-hover',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
