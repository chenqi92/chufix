import { useMemo } from 'react';
import { domainOf, linearScale, ticks } from '../_charts/scale';
import type { BarChartProps } from './variants';

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;

export function BarChart(props: BarChartProps) {
  const {
    data,
    labels,
    width = 480,
    height = 240,
    colorIndex = 0,
    showGrid = true,
    showLabels = true,
    ariaLabel = '柱状图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!data?.length) return null;
    const dom = domainOf([0, ...data]);
    const sy = linearScale(dom, { start: height - padBottom, end: padTop });
    const innerW = width - padLeft - padRight;
    const slot = innerW / data.length;
    const barW = Math.max(2, slot * 0.7);
    const yTicks = ticks(dom, 5);
    const bars = data.map((v, i) => {
      const cx = padLeft + slot * (i + 0.5);
      const y0 = sy(0);
      const y1 = sy(v);
      return {
        x: cx - barW / 2,
        y: Math.min(y0, y1),
        width: barW,
        height: Math.abs(y1 - y0),
        label: labels?.[i] ?? '',
        cx,
      };
    });
    return { sy, yTicks, bars };
  }, [data, labels, width, height]);

  return (
    <svg
      className={['cf-chart', `cf-chart__series-${colorIndex}`, className]
        .filter(Boolean)
        .join(' ')}
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
                  {Math.round(t)}
                </text>
              ))
            : null}
          {showLabels && layout.bars.length <= 24
            ? layout.bars.map((b, i) => (
                <text
                  key={`xl${i}`}
                  x={b.cx}
                  y={height - 6}
                  textAnchor="middle"
                >
                  {b.label}
                </text>
              ))
            : null}
          {layout.bars.map((b, i) => (
            <rect
              key={i}
              className="cf-chart__bar"
              x={b.x}
              y={b.y}
              width={b.width}
              height={b.height}
              rx={1.5}
            />
          ))}
        </>
      ) : null}
    </svg>
  );
}
