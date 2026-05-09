import { useMemo } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { ScatterPlotProps } from './variants';

export function ScatterPlot(props: ScatterPlotProps) {
  const {
    data,
    width = 480,
    height = 240,
    ariaLabel = '散点图',
    className,
  } = props;

  const points = useMemo(() => {
    if (!data?.length) return null;
    const xs = data.map((p) => p.x);
    const ys = data.map((p) => p.y);
    const dx = domainOf(xs);
    const dy = domainOf(ys);
    const sx = linearScale(dx, { start: 36, end: width - 12 });
    const sy = linearScale(dy, { start: height - 24, end: 12 });
    const groups = Array.from(new Set(data.map((p) => p.group ?? 'default')));
    return data.map((p) => ({
      cx: sx(p.x),
      cy: sy(p.y),
      r: p.r ?? 3,
      groupIdx: groups.indexOf(p.group ?? 'default') % 8,
    }));
  }, [data, width, height]);

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {points?.map((p, i) => (
        <circle
          key={i}
          className={`cf-chart__bar--${p.groupIdx}`}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          opacity={0.7}
        />
      ))}
    </svg>
  );
}
