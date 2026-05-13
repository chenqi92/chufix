import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ParallelHoverPayload,
  ParallelItem,
  ParallelProps as BaseProps,
} from './variants';

export type ParallelCoordinatesProps = BaseProps & {
  onHover?: (p: ParallelHoverPayload | null) => void;
  onSelect?: (p: ParallelHoverPayload) => void;
};

const DEFAULT_PALETTE = [
  'var(--viz-1, oklch(64% 0.16 263))',
  'var(--viz-2, oklch(70% 0.13 175))',
  'var(--viz-3, oklch(74% 0.16 80))',
  'var(--viz-4, oklch(64% 0.18 30))',
  'var(--viz-5, oklch(68% 0.18 320))',
  'var(--viz-6, oklch(72% 0.14 220))',
  'var(--viz-7, oklch(70% 0.13 140))',
  'var(--viz-8, oklch(68% 0.18 0))',
];

const PAD_L = 40;
const PAD_R = 40;
const PAD_T = 28;
const PAD_B = 24;

interface AxisInfo {
  key: string;
  label: string;
  min: number;
  max: number;
  reversed: boolean;
  x: number;
  format?: (v: number) => string;
}

export function ParallelCoordinates(props: ParallelCoordinatesProps) {
  const {
    axes,
    items,
    height = 280,
    ticks = 5,
    palette = DEFAULT_PALETTE,
    highlight = null,
    ariaLabel,
    size = 'md',
    onHover,
    onSelect,
  } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [innerW, setInnerW] = useState(560);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerW(Math.max(360, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const groupColorMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    let idx = 0;
    for (const it of items) {
      const g = it.group ?? '__default';
      if (!(g in map)) {
        map[g] = palette[idx % palette.length];
        idx++;
      }
    }
    return map;
  }, [items, palette]);

  const axisInfos = useMemo<AxisInfo[]>(() => {
    const n = axes.length;
    if (n === 0) return [];
    const step = (innerW - PAD_L - PAD_R) / Math.max(1, n - 1);
    return axes.map((a, i) => {
      const explicitMin = a.min;
      const explicitMax = a.max;
      let dMin = Infinity;
      let dMax = -Infinity;
      for (const it of items) {
        const v = it.values[a.key];
        if (typeof v === 'number') {
          if (v < dMin) dMin = v;
          if (v > dMax) dMax = v;
        }
      }
      if (!isFinite(dMin)) { dMin = 0; dMax = 1; }
      if (dMin === dMax) { dMin -= 1; dMax += 1; }
      return {
        key: a.key,
        label: a.label,
        min: explicitMin ?? dMin,
        max: explicitMax ?? dMax,
        reversed: a.reversed ?? false,
        x: PAD_L + i * step,
        format: a.format,
      };
    });
  }, [axes, items, innerW]);

  const y = (axis: AxisInfo, v: number) => {
    const usable = height - PAD_T - PAD_B;
    const t = (v - axis.min) / (axis.max - axis.min || 1);
    const tt = axis.reversed ? t : 1 - t;
    return PAD_T + tt * usable;
  };

  const pathFor = (item: ParallelItem) => {
    if (axisInfos.length === 0) return '';
    return axisInfos
      .map((a, i) => {
        const v = item.values[a.key] ?? a.min;
        return `${i === 0 ? 'M' : 'L'} ${a.x} ${y(a, v)}`;
      })
      .join(' ');
  };

  const colorFor = (item: ParallelItem) => item.color ?? groupColorMap[item.group ?? '__default'];

  const [hovered, setHovered] = useState<number | null>(highlight);

  const tickValues = (a: AxisInfo): number[] => {
    const out: number[] = [];
    for (let i = 0; i < ticks; i++) {
      out.push(a.min + ((a.max - a.min) * i) / (ticks - 1));
    }
    return out;
  };

  const tickLabel = (a: AxisInfo, v: number): string => {
    if (a.format) return a.format(v);
    if (Math.abs(v) >= 1000) return v.toLocaleString();
    return v.toFixed(Math.abs(v) < 10 ? 2 : 1);
  };

  const groups = Object.keys(groupColorMap).filter((g) => g !== '__default');

  return (
    <figure className={`cf-parallel cf-parallel--${size}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${height}`}
        preserveAspectRatio="none"
        height={height}
        aria-label={ariaLabel ?? '平行坐标图'}
        role="img"
      >
        <g className="cf-parallel__axes">
          {axisInfos.map((a) => (
            <g key={a.key}>
              <line x1={a.x} x2={a.x} y1={PAD_T} y2={height - PAD_B} className="cf-parallel__axis" />
              <text x={a.x} y={PAD_T - 10} textAnchor="middle" className="cf-parallel__axis-title">{a.label}</text>
              <g className="cf-parallel__ticks">
                {tickValues(a).map((t, ti) => (
                  <text key={ti} x={a.x - 6} y={y(a, t)} className="cf-parallel__tick" textAnchor="end" dominantBaseline="middle">
                    {tickLabel(a, t)}
                  </text>
                ))}
              </g>
            </g>
          ))}
        </g>

        <g className="cf-parallel__lines">
          {items.map((it, i) => (
            <path
              key={i}
              d={pathFor(it)}
              stroke={colorFor(it)}
              opacity={hovered === null || hovered === i ? 0.85 : 0.18}
              strokeWidth={hovered === i ? 2.4 : 1.4}
              fill="none"
              className="cf-parallel__line"
              tabIndex={0}
              aria-label={it.label}
              onMouseEnter={() => {
                setHovered(i);
                onHover?.({ index: i, item: it });
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.({ index: i, item: it })}
            />
          ))}
        </g>
      </svg>

      {groups.length > 0 && (
        <footer className="cf-parallel__legend">
          {groups.map((g) => (
            <span key={g} className="cf-parallel__legend-item">
              <span className="cf-parallel__swatch" style={{ background: groupColorMap[g] }} />
              {g}
            </span>
          ))}
        </footer>
      )}

      {hovered !== null && items[hovered] && (
        <figcaption className="cf-parallel__tip">
          <span className="cf-parallel__tip-label">{items[hovered].label}</span>
          {axisInfos.map((a) => (
            <span key={a.key} className="cf-parallel__tip-row">
              {a.label}: {tickLabel(a, items[hovered].values[a.key] ?? a.min)}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
