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
    onClick,
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
      onClick={(ev) => {
        if (!onClick || !data?.length) return;
        const target = ev.currentTarget;
        const rect = target.getBoundingClientRect();
        const ratio = rect.width ? (ev.clientX - rect.left) / rect.width : 0;
        const dataIndex = Math.max(
          0,
          Math.min(data.length - 1, Math.round(ratio * (data.length - 1))),
        );
        onClick({ dataIndex, value: data[dataIndex], nativeEvent: ev });
      }}
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
