import { useMemo } from 'react';
import { polar } from '../_charts/scale';
import type { ConnectionGraphProps } from './variants';

export function ConnectionGraph(props: ConnectionGraphProps) {
  const {
    nodes,
    edges,
    width = 480,
    height = 360,
    showLabels = true,
    ariaLabel = '关系图',
    className,
  } = props;

  const layout = useMemo(() => {
    if (!nodes?.length) return null;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) / 2 - 24;

    const positions = new Map<string, { x: number; y: number }>();
    nodes.forEach((n, i) => {
      if (typeof n.x === 'number' && typeof n.y === 'number') {
        positions.set(n.id, { x: n.x, y: n.y });
      } else {
        positions.set(n.id, polar(cx, cy, r, (i / nodes.length) * 360));
      }
    });

    const edgePaths = (edges ?? [])
      .map((e, i) => {
        const a = positions.get(e.source);
        const b = positions.get(e.target);
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 - 20;
        return {
          d: `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`,
          weight: e.weight ?? 1,
          colorIndex: e.colorIndex ?? i % 8,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);

    const nodePoints = nodes.map((n, i) => {
      const p = positions.get(n.id)!;
      return {
        id: n.id,
        x: p.x,
        y: p.y,
        label: n.label,
        colorIndex: n.colorIndex ?? i % 8,
        size: n.size ?? 8,
      };
    });

    return { nodePoints, edgePaths };
  }, [nodes, edges, width, height]);

  return (
    <svg
      className={['cf-chart', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.edgePaths.map((e, i) => (
        <path
          key={`e${i}`}
          className={`cf-chart__bar--${e.colorIndex}`}
          d={e.d}
          strokeWidth={e.weight}
          stroke="currentColor"
          fill="none"
          opacity={0.4}
        />
      ))}
      {layout?.nodePoints.map((n) => (
        <g key={n.id}>
          <circle
            className={`cf-chart__bar--${n.colorIndex}`}
            cx={n.x}
            cy={n.y}
            r={n.size}
            stroke="var(--bg-1)"
            strokeWidth={2}
          />
          {showLabels ? (
            <text x={n.x} y={n.y + n.size + 12} textAnchor="middle">
              {n.label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
