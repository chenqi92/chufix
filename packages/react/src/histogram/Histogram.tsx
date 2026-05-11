import { useMemo } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { HistogramProps } from './variants';

export function Histogram(props: HistogramProps) {
  const {
    bins,
    width = 480,
    height = 200,
    colorIndex = 0,
    showLabels = true,
    ariaLabel = '直方图',
    className,
  } = props;

  const padBottom = 24;
  const padLeft = 24;
  const padRight = 12;
  const padTop = 8;

  const bars = useMemo(() => {
    const data = bins ?? [];
    if (!data.length) return [];
    const counts = data.map((b) => b.count);
    const dom = domainOf([0, ...counts]);
    const sy = linearScale(dom, { start: height - padBottom, end: padTop });
    const innerW = width - padLeft - padRight;
    const slot = innerW / data.length;
    const barW = Math.max(1, slot - 1);
    return data.map((b, i) => ({
      x: padLeft + slot * i + (slot - barW) / 2,
      y: sy(b.count),
      width: barW,
      height: Math.abs(sy(0) - sy(b.count)),
      label: b.label,
    }));
  }, [bins, width, height]);

  return (
    <svg
      className={[
        'cf-chart',
        `cf-chart__series-${colorIndex}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          className="cf-chart__bar"
          x={b.x}
          y={b.y}
          width={b.width}
          height={b.height}
        />
      ))}
      {showLabels && bars.length <= 16
        ? bars.map((b, i) => (
            <text
              key={`l${i}`}
              x={b.x + b.width / 2}
              y={height - 6}
              textAnchor="middle"
            >
              {b.label}
            </text>
          ))
        : null}
    </svg>
  );
}
