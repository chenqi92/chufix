export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  /** when shape=text, number of lines to render. Last line is 60% wide. */
  lines?: number;
  /** disable shimmer animation, render plain block. */
  static?: boolean;
}

export function skeletonClass(p: { shape: SkeletonShape; isStatic: boolean }): string {
  return [
    'ck-skeleton',
    `ck-skeleton--${p.shape}`,
    p.isStatic && 'ck-skeleton--static',
  ]
    .filter(Boolean)
    .join(' ');
}
