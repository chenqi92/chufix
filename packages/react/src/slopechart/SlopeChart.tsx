import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  SlopeHoverPayload,
  SlopeItem,
  SlopeProps as BaseProps,
} from './variants';

export type SlopeChartProps = BaseProps & {
  onHover?: (p: SlopeHoverPayload | null) => void;
  onSelect?: (p: SlopeHoverPayload) => void;
};

const PAD_T = 36;
const PAD_B = 24;

export function SlopeChart(props: SlopeChartProps) {
  const {
    items,
    beforeLabel = '之前',
    afterLabel = '之后',
    height = 320,
    colorByDirection = true,
    format,
    ariaLabel,
    size = 'md',
    onHover,
    onSelect,
  } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [innerW, setInnerW] = useState(420);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerW(Math.max(280, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const all = useMemo(() => items.flatMap((i) => [i.before, i.after]), [items]);
  const min = Math.min(...all);
  const max = Math.max(...all);

  const y = (v: number) => {
    const range = height - PAD_T - PAD_B;
    const span = max - min || 1;
    return PAD_T + range - ((v - min) / span) * range;
  };
  const xL = innerW * 0.32;
  const xR = innerW * 0.68;

  function colorFor(item: SlopeItem): string {
    if (item.color) return item.color;
    if (!colorByDirection) return 'var(--accent-1)';
    if (item.after > item.before) return 'var(--status-success)';
    if (item.after < item.before) return 'var(--status-error)';
    return 'var(--fg-3)';
  }

  const offsetsFor = (side: 'before' | 'after') => {
    const yMap = new Map<number, number>();
    const offsets: number[] = [];
    for (const it of items) {
      const v = side === 'before' ? it.before : it.after;
      const yv = Math.round(y(v));
      const c = yMap.get(yv) ?? 0;
      offsets.push(c * 14);
      yMap.set(yv, c + 1);
    }
    return offsets;
  };
  const offBefore = useMemo(() => offsetsFor('before'), [items, innerW, height, min, max]);
  const offAfter = useMemo(() => offsetsFor('after'), [items, innerW, height, min, max]);

  const [hovered, setHovered] = useState<number | null>(null);
  const fmt = (v: number) => (format ? format(v) : v.toLocaleString());
  function payload(i: number): SlopeHoverPayload {
    return { index: i, item: items[i], delta: items[i].after - items[i].before };
  }

  return (
    <figure className={`cf-slope cf-slope--${size}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${height}`}
        preserveAspectRatio="none"
        height={height}
        aria-label={ariaLabel ?? `${beforeLabel} 与 ${afterLabel} 对比`}
        role="img"
      >
        <text x={xL} y={20} className="cf-slope__col-head">{beforeLabel}</text>
        <text x={xR} y={20} className="cf-slope__col-head">{afterLabel}</text>

        <line x1={xL} x2={xL} y1={PAD_T} y2={height - PAD_B} className="cf-slope__rail" />
        <line x1={xR} x2={xR} y1={PAD_T} y2={height - PAD_B} className="cf-slope__rail" />

        {items.map((it, i) => (
          <g
            key={i}
            className={
              'cf-slope__series' +
              (hovered === i ? ' is-hovered' : '') +
              (hovered !== null && hovered !== i ? ' is-dimmed' : '')
            }
            tabIndex={0}
            aria-label={`${it.label}: ${fmt(it.before)} → ${fmt(it.after)}`}
            onMouseEnter={() => {
              setHovered(i);
              onHover?.(payload(i));
            }}
            onMouseLeave={() => {
              setHovered(null);
              onHover?.(null);
            }}
            onClick={() => onSelect?.(payload(i))}
          >
            <line x1={xL} x2={xR} y1={y(it.before)} y2={y(it.after)} stroke={colorFor(it)} strokeWidth={2} className="cf-slope__line" />
            <circle cx={xL} cy={y(it.before)} r={4} fill={colorFor(it)} />
            <circle cx={xR} cy={y(it.after)} r={4} fill={colorFor(it)} />
            <text x={xL - 8} y={y(it.before) + offBefore[i] + 4} className="cf-slope__endpoint cf-slope__endpoint--left">
              {it.label} {fmt(it.before)}
            </text>
            <text x={xR + 8} y={y(it.after) + offAfter[i] + 4} className="cf-slope__endpoint cf-slope__endpoint--right">
              {fmt(it.after)} {it.label}
            </text>
          </g>
        ))}
      </svg>
      {hovered !== null && (
        <figcaption className="cf-slope__tip">
          <span className="cf-slope__tip-label">{items[hovered].label}</span>
          <span className="cf-slope__tip-row">
            {fmt(items[hovered].before)} → {fmt(items[hovered].after)}
          </span>
          <span
            className={
              'cf-slope__tip-delta' +
              (items[hovered].after > items[hovered].before ? ' is-up' : '') +
              (items[hovered].after < items[hovered].before ? ' is-down' : '')
            }
          >
            {items[hovered].after - items[hovered].before > 0 ? '+' : ''}
            {fmt(items[hovered].after - items[hovered].before)}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
