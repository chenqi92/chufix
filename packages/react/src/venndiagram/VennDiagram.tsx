import { useMemo, useState } from 'react';
import type {
  VennHoverPayload,
  VennIntersection,
  VennProps as BaseProps,
  VennSet,
} from './variants';

export type VennDiagramProps = BaseProps & {
  onHover?: (p: VennHoverPayload | null) => void;
  onSelect?: (p: VennHoverPayload) => void;
};

const DEFAULT_PALETTE = [
  'var(--viz-1, oklch(64% 0.16 263))',
  'var(--viz-2, oklch(70% 0.13 175))',
  'var(--viz-3, oklch(74% 0.16 80))',
];

interface Circle {
  cx: number;
  cy: number;
  r: number;
  color: string;
  set: VennSet;
  index: number;
}

export function VennDiagram(props: VennDiagramProps) {
  const {
    sets,
    intersections,
    size = 320,
    format,
    ariaLabel,
    variant = 'md',
    onHover,
    onSelect,
  } = props;

  const circles = useMemo<Circle[]>(() => {
    const n = sets.length;
    const center = size / 2;
    const maxR = size * 0.34;
    const minR = size * 0.18;
    const counts = sets.map((s) => Math.max(1, s.count));
    const maxC = Math.max(...counts);
    const minC = Math.min(...counts);
    const radii = counts.map((c) => {
      if (maxC === minC) return maxR * 0.85;
      const t = (c - minC) / (maxC - minC);
      return minR + t * (maxR - minR);
    });
    const spread = size * 0.18;
    if (n === 2) {
      return [
        { cx: center - spread, cy: center, r: radii[0], color: sets[0].color ?? DEFAULT_PALETTE[0], set: sets[0], index: 0 },
        { cx: center + spread, cy: center, r: radii[1], color: sets[1].color ?? DEFAULT_PALETTE[1], set: sets[1], index: 1 },
      ];
    }
    const offsetY = spread * 0.5;
    return [
      { cx: center - spread, cy: center + offsetY, r: radii[0], color: sets[0].color ?? DEFAULT_PALETTE[0], set: sets[0], index: 0 },
      { cx: center + spread, cy: center + offsetY, r: radii[1], color: sets[1].color ?? DEFAULT_PALETTE[1], set: sets[1], index: 1 },
      { cx: center, cy: center - spread * 0.7, r: radii[2], color: sets[2].color ?? DEFAULT_PALETTE[2], set: sets[2], index: 2 },
    ];
  }, [sets, size]);

  const intersectionCenter = (indices: number[]) => {
    const xs = indices.map((i) => circles[i].cx);
    const ys = indices.map((i) => circles[i].cy);
    return { x: xs.reduce((a, b) => a + b, 0) / xs.length, y: ys.reduce((a, b) => a + b, 0) / ys.length };
  };

  const soloCenter = (i: number) => {
    const c = circles[i];
    const center = size / 2;
    const dx = c.cx - center;
    const dy = c.cy - center;
    const m = Math.hypot(dx, dy) || 1;
    const push = c.r * 0.55;
    return { x: c.cx + (dx / m) * push, y: c.cy + (dy / m) * push };
  };

  const fmt = (n: number) => (format ? format(n) : n.toLocaleString());

  const soloLabel = (i: number): string => {
    if (!intersections) return fmt(sets[i].count);
    const overlap = intersections.filter((it) => it.sets.includes(i)).reduce((s, it) => s + it.count, 0);
    return fmt(Math.max(0, sets[i].count - overlap));
  };

  const [hovered, setHovered] = useState<VennHoverPayload | null>(null);

  return (
    <figure className={`cf-venn cf-venn--${variant}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label={ariaLabel ?? '韦恩图'} role="img">
        <g className="cf-venn__circles">
          {circles.map((c) => (
            <circle
              key={c.index}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill={c.color}
              stroke={c.color}
              fillOpacity={0.32}
              strokeWidth={1.5}
              strokeOpacity={0.85}
              className="cf-venn__circle"
              tabIndex={0}
              aria-label={`${c.set.label}: ${c.set.count}`}
              onMouseEnter={() => {
                const p: VennHoverPayload = { type: 'set', setIndex: c.index, set: c.set };
                setHovered(p);
                onHover?.(p);
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.({ type: 'set', setIndex: c.index, set: c.set })}
            />
          ))}
        </g>

        <g className="cf-venn__set-labels">
          {circles.map((c) => {
            const p = soloCenter(c.index);
            return (
              <text key={`l-${c.index}`} x={p.x} y={p.y - 14} className="cf-venn__set-label" textAnchor="middle">
                {c.set.label}
              </text>
            );
          })}
          {circles.map((c) => {
            const p = soloCenter(c.index);
            return (
              <text key={`s-${c.index}`} x={p.x} y={p.y + 6} className="cf-venn__set-count" textAnchor="middle">
                {soloLabel(c.index)}
              </text>
            );
          })}
        </g>

        {intersections && intersections.length > 0 && (
          <g className="cf-venn__intersections">
            {intersections.map((inter, i) => {
              const p = intersectionCenter(inter.sets);
              return (
                <g key={i}>
                  <text x={p.x} y={p.y - 4} className="cf-venn__inter-label" textAnchor="middle">
                    {inter.label ?? `∩ ${inter.sets.length}`}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 10}
                    className="cf-venn__inter-count"
                    textAnchor="middle"
                    tabIndex={0}
                    aria-label={`交集 ${inter.sets.join(',')}: ${fmt(inter.count)}`}
                    onMouseEnter={() => {
                      const payload: VennHoverPayload = { type: 'intersection', intersection: inter };
                      setHovered(payload);
                      onHover?.(payload);
                    }}
                    onMouseLeave={() => {
                      setHovered(null);
                      onHover?.(null);
                    }}
                    onClick={() => onSelect?.({ type: 'intersection', intersection: inter })}
                  >
                    {fmt(inter.count)}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
      {hovered && (
        <figcaption className="cf-venn__tip">
          {hovered.type === 'set' && hovered.set && (
            <>
              <span className="cf-venn__tip-label">{hovered.set.label}</span>
              <span className="cf-venn__tip-row">{fmt(hovered.set.count)}</span>
            </>
          )}
          {hovered.type === 'intersection' && hovered.intersection && (
            <>
              <span className="cf-venn__tip-label">{hovered.intersection.label ?? '交集'}</span>
              <span className="cf-venn__tip-row">{fmt(hovered.intersection.count)}</span>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
