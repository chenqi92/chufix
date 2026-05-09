export type CarouselSize = 'sm' | 'md' | 'lg';

export interface CarouselItem {
  key?: string | number;
  src?: string;
  alt?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  modelValue?: number;
  defaultValue?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  controls?: boolean;
  indicators?: boolean;
  size?: CarouselSize;
  className?: string;
}

export function carouselClass(p: {
  size: CarouselSize;
  className?: string;
}): string {
  return ['cf-carousel', `cf-carousel--${p.size}`, p.className].filter(Boolean).join(' ');
}
