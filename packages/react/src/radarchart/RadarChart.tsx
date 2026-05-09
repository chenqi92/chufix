import { useMemo } from 'react';
import { polar } from '../_charts/scale';
import type { RadarChartProps } from './variants';

export function RadarChart(props: RadarChartProps) {
  const {
    axes,
    series,
    size = 240,
    max,
    showLegend = true,
    ariaLabel = '雷达图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!axes?.length || !series?.length) return null;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 24;
    const m = max ?? Math.max(...series.flatMap((s) => s.values), 1);
    const angleStep = 360 / axes.length;
    const axisPoints = axes.map((_, i) => polar(cx, cy, r, i * angleStep));
    const grid = [0.25, 0.5, 0.75, 1].map((scale) =>
      axes.map((_, i) => polar(cx, cy, r * scale, i * angleStep)),
    );
    const polygons = series.map((s, idx) => {
      const points = s.values.map((v, i) =>
        polar(cx, cy, r * (v / m), i * angleStep),
      );
      const d = 'M ' + points.map((p) => `${p.x} ${p.y}`).join(' L ') + ' Z';
      return { idx: s.colorIndex ?? idx % 8, name: s.name, d };
    });
    return { cx, cy, r, axisPoints, grid, polygons };
  }, [axes, series, size, max]);

  return (
    <div
      className={['cf-radar', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        className="cf-chart"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
      >
        {layout?.grid.map((ring, i) => (
          <polygon
            key={`g${i}`}
            points={ring.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            className="cf-chart__grid"
          />
        ))}
        {layout?.axisPoints.map((p, i) => (
          <line
            key={`ax${i}`}
            className="cf-chart__axis"
            x1={layout.cx}
            y1={layout.cy}
            x2={p.x}
            y2={p.y}
          />
        ))}
        {layout?.axisPoints.map((p, i) => (
          <text key={`tx${i}`} x={p.x} y={p.y - 6} textAnchor="middle">
            {axes[i]}
          </text>
        ))}
        {layout?.polygons.map((p, i) => (
          <path
            key={`p${i}`}
            d={p.d}
            className={`cf-chart__bar--${p.idx}`}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
      </svg>
      {showLegend && layout ? (
        <ul className="cf-radar__legend">
          {layout.polygons.map((p) => (
            <li key={p.name}>
              <span className={`cf-radar__dot cf-chart__bar--${p.idx}`} />
              {p.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
