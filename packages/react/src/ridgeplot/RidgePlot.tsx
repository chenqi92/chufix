import { useMemo } from 'react';
import { areaPath, linearScale, linePath } from '../_charts/scale';
import type { RidgePlotProps } from './variants';

export function RidgePlot(props: RidgePlotProps) {
  const {
    rows,
    width = 480,
    height = 240,
    overlap = 0.6,
    ariaLabel = '密度脊图',
    className,
  } = props;

  const data = useMemo(() => {
    if (!rows?.length) return [];
    const maxDensity = Math.max(...rows.flatMap((r) => r.density), 1);
    const innerW = width - 80;
    const rowH = height / rows.length;
    const visibleH = rowH / (1 - overlap);
    return rows.map((r, i) => {
      const baseY = (i + 1) * rowH;
      const sx = linearScale(
        { min: 0, max: r.density.length - 1 },
        { start: 80, end: 80 + innerW },
      );
      const sy = linearScale(
        { min: 0, max: maxDensity },
        { start: baseY, end: baseY - visibleH },
      );
      const points = r.density.map((v, idx) => ({ x: sx(idx), y: sy(v) }));
      return {
        label: r.label,
        colorIndex: r.colorIndex ?? i % 8,
        area: areaPath(points, baseY),
        line: linePath(points, true),
        labelY: baseY - 4,
      };
    });
  }, [rows, width, height, overlap]);

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {data.map((r, i) => (
        <g key={i} className={`cf-chart__series-${r.colorIndex}`}>
          <path className="cf-chart__area" d={r.area} />
          <path className="cf-chart__line" d={r.line} />
          <text x={6} y={r.labelY}>
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
