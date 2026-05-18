import { useMemo } from 'react';
import { domainOf, linearScale } from '../_charts/scale';
import type { ViolinPlotProps } from './variants';

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

function histogram(values: number[], min: number, max: number, bins: number): number[] {
  const counts = new Array(bins).fill(0);
  const span = max - min || 1;
  for (const v of values) {
    let idx = Math.floor(((v - min) / span) * bins);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  }
  return counts;
}

function smooth(counts: number[], radius: number): number[] {
  if (radius <= 0) return counts.slice();
  const out = new Array(counts.length).fill(0);
  for (let i = 0; i < counts.length; i++) {
    let sum = 0;
    let weight = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = i + k;
      if (j < 0 || j >= counts.length) continue;
      const w = Math.exp(-(k * k) / (2 * radius * radius));
      sum += counts[j] * w;
      weight += w;
    }
    out[i] = sum / (weight || 1);
  }
  return out;
}

export function ViolinPlot(props: ViolinPlotProps) {
  const {
    data,
    width = 520,
    height = 280,
    bins = 24,
    bandwidth = 2,
    ariaLabel = '小提琴图',
    className,
    onItemEnter,
    onItemLeave,
  } = props;

  const layout = useMemo(() => {
    if (!data?.length) return null;
    const all = data.flatMap((s) => s.values);
    if (!all.length) return null;
    const dom = domainOf(all);
    const sy = linearScale(dom, { start: height - 32, end: 16 });
    const innerW = width - 56;
    const slot = innerW / data.length;
    const halfW = Math.max(8, slot * 0.35);
    const binsN = Math.max(4, bins);
    return data.map((s, i) => {
      const cx = 40 + slot * (i + 0.5);
      const sorted = s.values.slice().sort((a, b) => a - b);
      const q1 = quantile(sorted, 0.25);
      const med = quantile(sorted, 0.5);
      const q3 = quantile(sorted, 0.75);
      const min = sorted[0] ?? 0;
      const max = sorted[sorted.length - 1] ?? 0;
      const hist = smooth(histogram(s.values, dom.min, dom.max, binsN), bandwidth);
      const peak = Math.max(1, ...hist);
      const right: { x: number; y: number }[] = [];
      const left: { x: number; y: number }[] = [];
      for (let b = 0; b < binsN; b++) {
        const y = sy(dom.min + ((b + 0.5) / binsN) * (dom.max - dom.min));
        const w = (hist[b] / peak) * halfW;
        right.push({ x: cx + w, y });
        left.push({ x: cx - w, y });
      }
      const path =
        'M ' +
        right.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ') +
        ' L ' +
        left
          .slice()
          .reverse()
          .map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(' L ') +
        ' Z';
      return {
        cx,
        path,
        label: s.label,
        yMin: sy(min),
        yMax: sy(max),
        yQ1: sy(q1),
        yMed: sy(med),
        yQ3: sy(q3),
      };
    });
  }, [data, width, height, bins, bandwidth]);

  return (
    <svg
      className={['cf-chart cf-violin', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {layout?.map((v, i) => (
        <g
          key={i}
          className={`cf-chart__series-${i % 8}`}
          onPointerEnter={(e) => {
            const s = data?.[i];
            if (s) onItemEnter?.({ series: s, dataIndex: i, nativeEvent: e });
          }}
          onPointerLeave={(e) => {
            const s = data?.[i];
            if (s) onItemLeave?.({ series: s, dataIndex: i, nativeEvent: e });
          }}
        >
          <path className="cf-chart__area" d={v.path} opacity={0.5} />
          <path className="cf-chart__line" d={v.path} fill="none" strokeWidth={1.5} />
          <line
            className="cf-chart__line"
            x1={v.cx}
            x2={v.cx}
            y1={v.yMin}
            y2={v.yMax}
            strokeWidth={1}
            opacity={0.55}
          />
          <rect
            className="cf-chart__bar"
            x={v.cx - 3}
            y={v.yQ3}
            width={6}
            height={v.yQ1 - v.yQ3}
            opacity={0.85}
          />
          <line
            className="cf-chart__line"
            x1={v.cx - 6}
            x2={v.cx + 6}
            y1={v.yMed}
            y2={v.yMed}
            strokeWidth={2}
          />
          <text x={v.cx} y={height - 8} textAnchor="middle">
            {v.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
