import { useMemo } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { BoxPlotProps } from './variants';

export function BoxPlot(props: BoxPlotProps) {
  const {
    data,
    width = 480,
    height = 240,
    ariaLabel = '箱线图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const boxes = useMemo(() => {
    if (!data?.length) return null;
    const all = data.flatMap((s) => [
      s.min,
      s.q1,
      s.median,
      s.q3,
      s.max,
      ...(s.outliers ?? []),
    ]);
    const dom = domainOf(all);
    const sy = linearScale(dom, { start: height - 24, end: 12 });
    const innerW = width - 48;
    const slot = innerW / data.length;
    const boxW = Math.max(8, slot * 0.5);
    return data.map((s, i) => {
      const cx = 36 + slot * (i + 0.5);
      return {
        cx,
        boxX: cx - boxW / 2,
        boxW,
        yMin: sy(s.min),
        yMax: sy(s.max),
        yQ1: sy(s.q1),
        yQ3: sy(s.q3),
        yMed: sy(s.median),
        label: s.label,
        outliers: (s.outliers ?? []).map((v) => sy(v)),
      };
    });
  }, [data, width, height]);

  return (
    <svg
      className={['cf-chart cf-boxplot', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {boxes?.map((b, i) => (
        <g
          key={i}
          className={`cf-chart__series-${i % 8}`}
          onPointerEnter={(e) => {
            const box = data?.[i];
            if (box) onItemEnter?.({ box, dataIndex: i, nativeEvent: e });
          }}
          onPointerLeave={(e) => {
            const box = data?.[i];
            if (box) onItemLeave?.({ box, dataIndex: i, nativeEvent: e });
          }}
        >
          <line
            className="cf-chart__line"
            x1={b.cx}
            x2={b.cx}
            y1={b.yMin}
            y2={b.yMax}
          />
          <line
            className="cf-chart__line"
            x1={b.boxX}
            x2={b.boxX + b.boxW}
            y1={b.yMin}
            y2={b.yMin}
          />
          <line
            className="cf-chart__line"
            x1={b.boxX}
            x2={b.boxX + b.boxW}
            y1={b.yMax}
            y2={b.yMax}
          />
          <rect
            className="cf-chart__bar"
            x={b.boxX}
            y={b.yQ3}
            width={b.boxW}
            height={b.yQ1 - b.yQ3}
            opacity={0.4}
          />
          <line
            className="cf-chart__line"
            x1={b.boxX}
            x2={b.boxX + b.boxW}
            y1={b.yMed}
            y2={b.yMed}
            strokeWidth={2}
          />
          {b.outliers.map((oy, oi) => (
            <circle
              key={`o${oi}`}
              className="cf-chart__dot"
              cx={b.cx}
              cy={oy}
              r={2}
              opacity={0.6}
            />
          ))}
          <text x={b.cx} y={height - 6} textAnchor="middle">
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
