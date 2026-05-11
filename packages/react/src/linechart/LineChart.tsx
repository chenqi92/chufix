import { useMemo } from 'react';
import {
  domainOf,
  linearScale,
  linePath,
  ticks,
} from '../_charts/scale';
import type { LineChartProps } from './variants';

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;

export function LineChart(props: LineChartProps) {
  const {
    series,
    labels,
    width = 480,
    height = 240,
    smooth = false,
    showGrid = true,
    showLabels = true,
    yLabelFn,
    ariaLabel = '折线图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!series?.length) return null;
    const lengths = series.map((s) => s.data.length);
    const maxLen = Math.max(...lengths, 1);
    const allValues = series.flatMap((s) => s.data);
    const dom = domainOf(allValues);
    const sx = linearScale(
      { min: 0, max: Math.max(1, maxLen - 1) },
      { start: padLeft, end: width - padRight },
    );
    const sy = linearScale(dom, { start: height - padBottom, end: padTop });
    const yTicks = ticks(dom, 5);
    const lines = series.map((s, idx) => {
      const points = s.data.map((v, i) => ({ x: sx(i), y: sy(v) }));
      return { idx, name: s.name, d: linePath(points, smooth) };
    });
    const lbls = labels ?? Array.from({ length: maxLen }, (_, i) => `${i}`);
    return { sx, sy, yTicks, lines, labels: lbls };
  }, [series, labels, width, height, smooth]);

  const formatY = (v: number) => (yLabelFn ? yLabelFn(v) : v.toFixed(0));

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout ? (
        <>
          {showGrid
            ? layout.yTicks.map((t, i) => (
                <line
                  key={`g${i}`}
                  className="cf-chart__grid"
                  x1={padLeft}
                  x2={width - padRight}
                  y1={layout.sy(t)}
                  y2={layout.sy(t)}
                />
              ))
            : null}
          {showLabels
            ? layout.yTicks.map((t, i) => (
                <text
                  key={`yl${i}`}
                  x={padLeft - 4}
                  y={layout.sy(t) + 4}
                  textAnchor="end"
                >
                  {formatY(t)}
                </text>
              ))
            : null}
          {showLabels && layout.labels.length <= 12
            ? layout.labels.map((label, i) => (
                <text
                  key={`xl${i}`}
                  x={layout.sx(i)}
                  y={height - 6}
                  textAnchor="middle"
                >
                  {label}
                </text>
              ))
            : null}
          {layout.lines.map((l) => (
            <g key={l.idx} className={`cf-chart__series-${l.idx}`}>
              <path className="cf-chart__line" d={l.d} />
            </g>
          ))}
        </>
      ) : null}
    </svg>
  );
}
