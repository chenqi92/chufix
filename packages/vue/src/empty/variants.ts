export type EmptySize = 'sm' | 'md' | 'lg';

export interface EmptyProps {
  /** 主标题文案 */
  title?: string;
  /** 副标题描述 */
  description?: string;
  size?: EmptySize;
}

export function emptyClass(p: { size: EmptySize }): string {
  return ['cf-empty', `cf-empty--${p.size}`].join(' ');
}
