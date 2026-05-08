import type { CSSProperties } from 'react';
import { type SkeletonProps, skeletonClass } from './variants';

function dim(v: string | number | undefined): string | undefined {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

export function Skeleton(props: SkeletonProps) {
  const { shape = 'rect', width, height, lines = 1, static: isStatic = false } = props;
  const cls = skeletonClass({ shape, isStatic });
  const baseStyle: CSSProperties = {};
  const w = dim(width);
  const h = dim(height);
  if (w) baseStyle.width = w;
  if (h) baseStyle.height = h;

  if (shape === 'text' && lines > 1) {
    return (
      <span className="cf-skeleton-stack">
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={cls}
            style={i === lines - 1 ? { ...baseStyle, width: '60%' } : baseStyle}
          />
        ))}
      </span>
    );
  }
  return <span className={cls} style={baseStyle} />;
}
