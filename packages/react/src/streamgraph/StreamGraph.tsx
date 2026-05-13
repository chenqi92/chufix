import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  StreamGraphHoverPayload,
  StreamGraphProps as BaseProps,
  StreamSeries,
} from './variants';

export type StreamGraphComponentProps = BaseProps & {
  onHover?: (p: StreamGraphHoverPayload | null) => void;
  onSelect?: (p: StreamGraphHoverPayload) => void;
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

const PAD_L = 12;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 24;

interface Lane {
  series: StreamSeries;
  color: string;
  top: number[];
  bottom: number[];
}

export function StreamGraph(props: StreamGraphComponentProps) {
  const {
    categories,
    series,
    height = 240,
    baseline = 'wiggle',
    smooth = true,
    palette = DEFAULT_PALETTE,
    format,
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

  const totals = useMemo<number[]>(() => {
    const n = categories.length;
    const out = new Array(n).fill(0);
    for (const s of series) {
      for (let i = 0; i < n; i++) out[i] += s.data[i] ?? 0;
    }
    return out;
  }, [categories.length, series]);

  const maxTotal = Math.max(1, ...totals);

  const lanes = useMemo<Lane[]>(() => {
    const n = categories.length;
    const usableH = height - PAD_T - PAD_B;
    const centerY = PAD_T + usableH / 2;
    const offsets = totals.map((t) => {
      if (baseline === 'wiggle') return centerY - ((t / maxTotal) * usableH) / 2;
      return PAD_T + usableH;
    });
    const out: Lane[] = series.map((s, idx) => ({
      series: s,
      color: s.color ?? palette[idx % palette.length],
      top: new Array(n),
      bottom: new Array(n),
    }));
    for (let i = 0; i < n; i++) {
      let y = offsets[i];
      for (let k = 0; k < out.length; k++) {
        const v = series[k].data[i] ?? 0;
        const h = (v / maxTotal) * usableH;
        if (baseline === 'wiggle') {
          out[k].top[i] = y;
          out[k].bottom[i] = y + h;
          y += h;
        } else {
          out[k].bottom[i] = y;
          out[k].top[i] = y - h;
          y -= h;
        }
      }
    }
    return out;
  }, [categories.length, series, totals, maxTotal, height, baseline, palette]);

  const bandStep = (innerW - PAD_L - PAD_R) / Math.max(1, categories.length - 1);
  const x = (i: number) => PAD_L + bandStep * i;

  const lanePath = (lane: Lane): string => {
    const n = categories.length;
    if (!n) return '';
    if (!smooth || n < 3) {
      let d = `M ${x(0)} ${lane.top[0]}`;
      for (let i = 1; i < n; i++) d += ` L ${x(i)} ${lane.top[i]}`;
      for (let i = n - 1; i >= 0; i--) d += ` L ${x(i)} ${lane.bottom[i]}`;
      return d + ' Z';
    }
    const smoothPath = (ys: number[]): string => {
      let d = `M ${x(0)} ${ys[0]}`;
      for (let i = 0; i < ys.length - 1; i++) {
        const xc = (x(i) + x(i + 1)) / 2;
        d += ` C ${xc} ${ys[i]} ${xc} ${ys[i + 1]} ${x(i + 1)} ${ys[i + 1]}`;
      }
      return d;
    };
    const top = smoothPath(lane.top);
    const bottomReversed = (() => {
      const ys = [...lane.bottom].reverse();
      const xs = categories.map((_, i) => x(n - 1 - i));
      let d = ` L ${xs[0]} ${ys[0]}`;
      for (let i = 0; i < ys.length - 1; i++) {
        const xc = (xs[i] + xs[i + 1]) / 2;
        d += ` C ${xc} ${ys[i]} ${xc} ${ys[i + 1]} ${xs[i + 1]} ${ys[i + 1]}`;
      }
      return d;
    })();
    return top + bottomReversed + ' Z';
  };

  const [hovered, setHovered] = useState<number | null>(null);
  const payload = (i: number): StreamGraphHoverPayload => {
    const values: Record<string, number> = {};
    for (const s of series) values[s.label] = s.data[i] ?? 0;
    return { index: i, category: categories[i], values };
  };
  const fmt = (v: number) => (format ? format(v) : v.toLocaleString());

  return (
    <figure className={`cf-streamgraph cf-streamgraph--${size}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${height}`}
        preserveAspectRatio="none"
        height={height}
        aria-label={ariaLabel ?? '河流图'}
        role="img"
      >
        <g className="cf-streamgraph__lanes">
          {lanes.map((lane, idx) => (
            <path key={idx} d={lanePath(lane)} fill={lane.color} opacity={0.85} className="cf-streamgraph__lane">
              <title>{lane.series.label}</title>
            </path>
          ))}
        </g>

        <g className="cf-streamgraph__hits">
          {categories.map((c, i) => (
            <rect
              key={i}
              x={x(i) - bandStep / 2}
              y={PAD_T}
              width={Math.max(bandStep, 1)}
              height={height - PAD_T - PAD_B}
              fill="transparent"
              tabIndex={0}
              aria-label={c}
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

        {hovered !== null && (
          <line x1={x(hovered)} x2={x(hovered)} y1={PAD_T} y2={height - PAD_B} className="cf-streamgraph__hover-line" />
        )}

        <g className="cf-streamgraph__x">
          {categories.map((c, i) => (
            <text key={`xl-${i}`} x={x(i)} y={height - PAD_B + 16} className="cf-streamgraph__axis-label" textAnchor="middle">
              {c}
            </text>
          ))}
        </g>
      </svg>

      {hovered !== null && (
        <figcaption className="cf-streamgraph__tip">
          <span className="cf-streamgraph__tip-cat">{categories[hovered]}</span>
          {series.map((s, idx) => (
            <span key={idx} className="cf-streamgraph__tip-row">
              <span className="cf-streamgraph__swatch" style={{ background: lanes[idx].color }} />
              {s.label}: {fmt(s.data[hovered] ?? 0)}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
