import type { ReactNode } from 'react';

export type CarouselSize = 'sm' | 'md' | 'lg';

export interface CarouselItem {
  key?: string | number;
  src?: string;
  alt?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  value?: number;
  defaultValue?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  controls?: boolean;
  indicators?: boolean;
  size?: CarouselSize;
  className?: string;
  onChange?: (index: number) => void;
  renderItem?: (item: CarouselItem, index: number) => ReactNode;
}

export function carouselClass(p: {
  size: CarouselSize;
  className?: string;
}): string {
  return ['cf-carousel', `cf-carousel--${p.size}`, p.className].filter(Boolean).join(' ');
}
