import type { ReactNode } from 'react';

export type TimelineSize = 'sm' | 'md' | 'lg';
export type TimelineMode = 'left' | 'right' | 'alternate';
export type TimelineDotColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

export interface TimelineItem {
  key?: string | number;
  title?: ReactNode;
  content?: ReactNode;
  time?: ReactNode;
  color?: TimelineDotColor;
  icon?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  size?: TimelineSize;
  mode?: TimelineMode;
  reverse?: boolean;
  className?: string;
}

export function timelineClass(p: {
  size: TimelineSize;
  mode: TimelineMode;
  className?: string;
}): string {
  return [
    'cf-timeline',
    `cf-timeline--${p.size}`,
    `cf-timeline--${p.mode}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
