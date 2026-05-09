import { useMemo } from 'react';
import { layoutTreemap, type TreemapProps } from './variants';

export function Treemap(props: TreemapProps) {
  const {
    nodes,
    width = 480,
    height = 240,
    showLabels = true,
    ariaLabel = '矩形树图',
    className,
  } = props;

  const rects = useMemo(
    () =>
      layoutTreemap(nodes ?? [], width, height).map((r, i) => ({
        ...r,
        colorIndex: r.colorIndex ?? i % 8,
      })),
    [nodes, width, height],
  );

  return (
    <svg
      className={['cf-chart cf-treemap', className]
        .filter(Boolean)
        .join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {rects.map((r, i) => (
        <g key={i}>
          <rect
            className={`cf-chart__bar--${r.colorIndex}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            stroke="var(--bg-1)"
            strokeWidth={1}
            opacity={0.9}
          />
          {showLabels && r.w > 50 && r.h > 20 ? (
            <text
              x={r.x + 6}
              y={r.y + 14}
              fill="var(--fg-on-viz)"
              fontWeight={500}
            >
              {r.name}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
