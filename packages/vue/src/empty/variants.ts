export type EmptySize = 'sm' | 'md' | 'lg';

export interface EmptyProps {
  /** 主标题文案 */
  title?: string;
  /** 副标题描述 */
  description?: string;
  size?: EmptySize;
  /** Optional image URL for product-specific empty states. Prefer the icon slot for custom SVG/icons. */
  image?: string;
  imageAlt?: string;
}

export function emptyClass(p: { size: EmptySize }): string {
  return ['cf-empty', `cf-empty--${p.size}`].join(' ');
}
