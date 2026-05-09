import { useMemo } from 'react';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
} from '../_charts/scale';
import type { SparklineProps } from './variants';

export function Sparkline(props: SparklineProps) {
  const {
    data,
    width = 80,
    height = 24,
    filled = false,
    smooth = false,
    colorIndex = 0,
    showDot = true,
    ariaLabel = '走势缩略图',
    className,
  } = props;

  const svg = useMemo(() => {
    if (!data?.length) return null;
    const dom = domainOf(data);
    const sx = linearScale(
      { min: 0, max: Math.max(1, data.length - 1) },
      { start: 1, end: width - 1 },
    );
    const sy = linearScale(dom, { start: height - 1, end: 1 });
    const points = data.map((v, i) => ({ x: sx(i), y: sy(v) }));
    return {
      line: linePath(points, smooth),
      area: areaPath(points, height - 1),
      last: points[points.length - 1],
    };
  }, [data, width, height, smooth]);

  const cls = [
    'cf-sparkline',
    `cf-chart__series-${colorIndex}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={cls}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {svg ? (
        <>
          {filled ? <path className="cf-chart__area" d={svg.area} /> : null}
          <path className="cf-chart__line" d={svg.line} />
          {showDot ? (
            <circle
              className="cf-chart__dot"
              cx={svg.last.x}
              cy={svg.last.y}
              r={2}
            />
          ) : null}
        </>
      ) : null}
    </svg>
  );
}
