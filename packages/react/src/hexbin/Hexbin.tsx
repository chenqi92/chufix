import { useMemo } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { HexbinProps, HexbinCell } from './variants';

function hexCorner(cx: number, cy: number, r: number, i: number) {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function hexPath(cx: number, cy: number, r: number): string {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const p = hexCorner(cx, cy, r, i);
    d += (i === 0 ? 'M' : 'L') + ` ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
  }
  return d + 'Z';
}

export function Hexbin(props: HexbinProps) {
  const {
    data,
    width = 560,
    height = 360,
    radius = 14,
    xDomain,
    yDomain,
    ariaLabel = '六边形热图',
    showAxis = true,
    className,
    onCellEnter,
    onCellLeave,
  } = props;

  const layout = useMemo(() => {
    if (!data?.length) return null;
    const xDom = xDomain
      ? { min: xDomain[0], max: xDomain[1] }
      : domainOf(data.map((d) => d.x));
    const yDom = yDomain
      ? { min: yDomain[0], max: yDomain[1] }
      : domainOf(data.map((d) => d.y));
    const left = 44;
    const right = width - 16;
    const top = 16;
    const bottom = height - 32;
    const sx = linearScale(xDom, { start: left, end: right });
    const sy = linearScale(yDom, { start: bottom, end: top });
    const r = radius;
    const dx = r * Math.sqrt(3);
    const dy = r * 1.5;
    const map = new Map<string, HexbinCell>();
    for (const p of data) {
      const px = sx(p.x);
      const py = sy(p.y);
      const row = Math.round((py - top) / dy);
      const offsetX = row % 2 === 0 ? 0 : dx / 2;
      const col = Math.round((px - left - offsetX) / dx);
      const cx = left + offsetX + col * dx;
      const cy = top + row * dy;
      const key = `${col}_${row}`;
      const cell = map.get(key) ?? { cx, cy, count: 0, weight: 0 };
      cell.count += 1;
      cell.weight += p.weight ?? 1;
      map.set(key, cell);
    }
    const cells = Array.from(map.values());
    const peak = Math.max(1, ...cells.map((c) => c.weight));
    return {
      cells: cells.map((c) => ({ ...c, path: hexPath(c.cx, c.cy, r), ratio: c.weight / peak })),
      xDom,
      yDom,
      left,
      right,
      top,
      bottom,
    };
  }, [data, width, height, radius, xDomain, yDomain]);

  return (
    <svg
      className={['cf-chart cf-hexbin', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout && (
        <>
          {showAxis && (
            <g>
              <line
                className="cf-chart__axis"
                x1={layout.left}
                x2={layout.right}
                y1={layout.bottom}
                y2={layout.bottom}
              />
              <line
                className="cf-chart__axis"
                x1={layout.left}
                x2={layout.left}
                y1={layout.top}
                y2={layout.bottom}
              />
              <text x={layout.left} y={height - 8} textAnchor="start">
                {layout.xDom.min.toFixed(1)}
              </text>
              <text x={layout.right} y={height - 8} textAnchor="end">
                {layout.xDom.max.toFixed(1)}
              </text>
              <text x={layout.left - 6} y={layout.bottom + 4} textAnchor="end">
                {layout.yDom.min.toFixed(1)}
              </text>
              <text x={layout.left - 6} y={layout.top + 4} textAnchor="end">
                {layout.yDom.max.toFixed(1)}
              </text>
            </g>
          )}
          <g className="cf-hexbin__cells">
            {layout.cells.map((c, i) => (
              <path
                key={i}
                className="cf-hexbin__cell"
                d={c.path}
                style={{ opacity: 0.18 + 0.82 * c.ratio }}
                onPointerEnter={(e) =>
                  onCellEnter?.({
                    cell: { cx: c.cx, cy: c.cy, count: c.count, weight: c.weight },
                    nativeEvent: e,
                  })
                }
                onPointerLeave={(e) =>
                  onCellLeave?.({
                    cell: { cx: c.cx, cy: c.cy, count: c.count, weight: c.weight },
                    nativeEvent: e,
                  })
                }
              />
            ))}
          </g>
        </>
      )}
    </svg>
  );
}
