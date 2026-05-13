import { useEffect, useMemo, useRef, useState } from 'react';
import { linePath } from '../_charts/scale';
import type {
  ParetoHoverPayload,
  ParetoItem,
  ParetoProps as BaseProps,
} from './variants';

export type ParetoChartProps = BaseProps & {
  onHover?: (p: ParetoHoverPayload | null) => void;
  onSelect?: (p: ParetoHoverPayload) => void;
};

const PAD_L = 44;
const PAD_R = 44;
const PAD_T = 16;
const PAD_B = 36;

export function ParetoChart(props: ParetoChartProps) {
  const {
    items,
    height = 260,
    cutoff = 0.8,
    barColor,
    lineColor,
    formatValue,
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
    const ro = new ResizeObserver(() => setInnerW(Math.max(280, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sorted = useMemo<ParetoItem[]>(() => [...items].sort((a, b) => b.value - a.value), [items]);
  const total = sorted.reduce((s, it) => s + it.value, 0);
  const max = sorted[0]?.value ?? 1;
  const cumulative = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const it of sorted) {
      acc += it.value;
      out.push(acc);
    }
    return out;
  }, [sorted]);

  const yBar = (v: number) => {
    const range = height - PAD_T - PAD_B;
    return PAD_T + range - (v / max) * range;
  };
  const yPct = (pct: number) => {
    const range = height - PAD_T - PAD_B;
    return PAD_T + range - pct * range;
  };

  const bandStep = (innerW - PAD_L - PAD_R) / Math.max(1, sorted.length);
  const barW = bandStep * 0.62;
  const bandCenter = (i: number) => PAD_L + bandStep * (i + 0.5);

  const pctPoints = sorted.map((_, i) => ({
    x: bandCenter(i),
    y: yPct(total ? cumulative[i] / total : 0),
  }));
  const linePathD = linePath(pctPoints, false);
  const cutoffY = yPct(cutoff);

  const [hovered, setHovered] = useState<number | null>(null);
  function payload(i: number): ParetoHoverPayload {
    return {
      index: i,
      item: sorted[i],
      cumulative: cumulative[i],
      cumulativePct: total ? cumulative[i] / total : 0,
    };
  }

  const fmt = (v: number) => (formatValue ? formatValue(v) : v.toLocaleString());
  const barBase = barColor ?? 'var(--accent-1)';
  const lineBase = lineColor ?? 'var(--status-warning)';

  const valueTicks = [0, max * 0.25, max * 0.5, max * 0.75, max];
  const pctTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className={`cf-pareto cf-pareto--${size}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${height}`}
        preserveAspectRatio="none"
        height={height}
        aria-label={ariaLabel ?? '帕累托分析图'}
        role="img"
      >
        <g className="cf-pareto__y">
          {valueTicks.map((t, i) => (
            <line key={`g-${i}`} x1={PAD_L} x2={innerW - PAD_R} y1={yBar(t)} y2={yBar(t)} className="cf-pareto__grid" />
          ))}
          {valueTicks.map((t, i) => (
            <text key={`yl-${i}`} x={PAD_L - 6} y={yBar(t)} className="cf-pareto__axis-label cf-pareto__axis-label--left">
              {fmt(t)}
            </text>
          ))}
          {pctTicks.map((t, i) => (
            <text key={`yr-${i}`} x={innerW - PAD_R + 6} y={yPct(t)} className="cf-pareto__axis-label cf-pareto__axis-label--right">
              {Math.round(t * 100)}%
            </text>
          ))}
        </g>

        <line x1={PAD_L} x2={innerW - PAD_R} y1={cutoffY} y2={cutoffY} className="cf-pareto__cutoff" />
        <text x={innerW - PAD_R - 4} y={cutoffY - 4} className="cf-pareto__cutoff-label">
          {Math.round(cutoff * 100)}%
        </text>

        <g className="cf-pareto__bars">
          {sorted.map((it, i) => (
            <rect
              key={i}
              x={bandCenter(i) - barW / 2}
              y={yBar(it.value)}
              width={barW}
              height={Math.max(0, height - PAD_B - yBar(it.value))}
              fill={it.color ?? barBase}
              opacity={hovered === null || hovered === i ? 1 : 0.4}
              className="cf-pareto__bar"
              tabIndex={0}
              aria-label={`${it.label}: ${fmt(it.value)}`}
              onMouseEnter={() => {
                setHovered(i);
                onHover?.(payload(i));
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover?.(null);
              }}
              onClick={() => onSelect?.(payload(i))}
            />
          ))}
        </g>

        <path d={linePathD} stroke={lineBase} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" className="cf-pareto__line" />
        <g className="cf-pareto__points">
          {pctPoints.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={hovered === i ? lineBase : 'var(--bg-1)'}
              stroke={lineBase}
              strokeWidth={1.6}
            />
          ))}
        </g>

        <g className="cf-pareto__x">
          {sorted.map((it, i) => (
            <text key={`xl-${i}`} x={bandCenter(i)} y={height - PAD_B + 16} className="cf-pareto__axis-label cf-pareto__axis-label--x">
              {it.label}
            </text>
          ))}
        </g>
      </svg>
      {hovered !== null && (
        <figcaption className="cf-pareto__tip">
          <span className="cf-pareto__tip-name">{sorted[hovered].label}</span>
          <span className="cf-pareto__tip-row">{fmt(sorted[hovered].value)}</span>
          <span className="cf-pareto__tip-row cf-pareto__tip-row--muted">
            累计 {Math.round((cumulative[hovered] / Math.max(1, total)) * 100)}%
          </span>
        </figcaption>
      )}
    </figure>
  );
}
