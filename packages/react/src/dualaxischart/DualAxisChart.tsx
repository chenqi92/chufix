import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { domainOf, linePath, linearScale, ticks } from '../_charts/scale';
import type {
  DualAxisHoverPayload,
  DualAxisProps as BaseProps,
} from './variants';

export type DualAxisChartProps = BaseProps & {
  onHover?: (p: DualAxisHoverPayload | null) => void;
  onSelect?: (p: DualAxisHoverPayload) => void;
};

const PAD_L = 44;
const PAD_R = 44;
const PAD_T = 16;
const PAD_B = 28;

export function DualAxisChart(props: DualAxisChartProps) {
  const {
    categories,
    bar,
    line,
    height = 240,
    formatBar,
    formatLine,
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

  const barDomain = useMemo(() => {
    const d = domainOf(bar.data);
    return { min: Math.min(0, d.min), max: d.max };
  }, [bar.data]);
  const lineDomain = useMemo(() => {
    const d = domainOf(line.data);
    return { min: Math.min(0, d.min), max: d.max };
  }, [line.data]);

  const barScale = useMemo(() => linearScale(barDomain, { start: height - PAD_B, end: PAD_T }), [barDomain, height]);
  const lineScale = useMemo(() => linearScale(lineDomain, { start: height - PAD_B, end: PAD_T }), [lineDomain, height]);

  const bandStep = (innerW - PAD_L - PAD_R) / Math.max(1, categories.length);
  const barW = bandStep * 0.6;
  const bandCenter = useCallback((i: number) => PAD_L + bandStep * (i + 0.5), [bandStep]);

  const linePts = useMemo(
    () => line.data.map((v, i) => ({ x: bandCenter(i), y: lineScale(v) })),
    [line.data, bandCenter, lineScale],
  );
  const linePathD = useMemo(() => linePath(linePts, line.smooth ?? false), [linePts, line.smooth]);

  const barTicks = useMemo(() => ticks(barDomain, 5), [barDomain]);
  const lineTicks = useMemo(() => ticks(lineDomain, 5), [lineDomain]);

  const [hovered, setHovered] = useState<number | null>(null);

  const fmtBar = (v: number) => (formatBar ? formatBar(v) : v.toLocaleString());
  const fmtLine = (v: number) => (formatLine ? formatLine(v) : v.toLocaleString());

  function payload(i: number): DualAxisHoverPayload {
    return { index: i, category: categories[i], barValue: bar.data[i], lineValue: line.data[i] };
  }

  const barColor = bar.color ?? 'var(--accent-1)';
  const lineColor = line.color ?? 'var(--status-warning)';

  return (
    <figure className={`cf-dual cf-dual--${size}`}>
      {(bar.label || line.label) && (
        <header className="cf-dual__legend">
          <span className="cf-dual__legend-item">
            <span className="cf-dual__swatch cf-dual__swatch--bar" style={{ background: barColor }} />
            {bar.label}
          </span>
          <span className="cf-dual__legend-item">
            <span className="cf-dual__swatch cf-dual__swatch--line" style={{ background: lineColor }} />
            {line.label}
          </span>
        </header>
      )}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${innerW} ${height}`}
        preserveAspectRatio="none"
        height={height}
        aria-label={ariaLabel ?? `${bar.label} 与 ${line.label} 组合图`}
        role="img"
      >
        <g className="cf-dual__y">
          {barTicks.map((t, i) => (
            <line key={`g-${i}`} x1={PAD_L} x2={innerW - PAD_R} y1={barScale(t)} y2={barScale(t)} className="cf-dual__grid" />
          ))}
          {barTicks.map((t, i) => (
            <text key={`yl-${i}`} x={PAD_L - 6} y={barScale(t)} className="cf-dual__axis-label cf-dual__axis-label--left">
              {fmtBar(t)}
            </text>
          ))}
          {lineTicks.map((t, i) => (
            <text key={`yr-${i}`} x={innerW - PAD_R + 6} y={lineScale(t)} className="cf-dual__axis-label cf-dual__axis-label--right">
              {fmtLine(t)}
            </text>
          ))}
        </g>

        <g className="cf-dual__bars">
          {bar.data.map((v, i) => (
            <rect
              key={i}
              x={bandCenter(i) - barW / 2}
              y={Math.min(barScale(v), barScale(0))}
              width={barW}
              height={Math.abs(barScale(v) - barScale(0))}
              fill={barColor}
              opacity={hovered === null || hovered === i ? 1 : 0.45}
              className="cf-dual__bar"
              tabIndex={0}
              aria-label={`${categories[i]}: ${fmtBar(v)}`}
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

        <path d={linePathD} stroke={lineColor} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" className="cf-dual__line" />
        <g className="cf-dual__points">
          {linePts.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={hovered === i ? lineColor : 'var(--bg-1)'}
              stroke={lineColor}
              strokeWidth={1.6}
              className="cf-dual__dot"
            />
          ))}
        </g>

        <g className="cf-dual__x">
          {categories.map((c, i) => (
            <text key={`cx-${i}`} x={bandCenter(i)} y={height - PAD_B + 16} className="cf-dual__axis-label cf-dual__axis-label--x">
              {c}
            </text>
          ))}
        </g>

        {hovered !== null && (
          <line
            x1={bandCenter(hovered)}
            x2={bandCenter(hovered)}
            y1={PAD_T}
            y2={height - PAD_B}
            className="cf-dual__hover-line"
          />
        )}
      </svg>
      {hovered !== null && (
        <figcaption className="cf-dual__tip">
          <span className="cf-dual__tip-cat">{categories[hovered]}</span>
          <span className="cf-dual__tip-row">
            <span className="cf-dual__swatch" style={{ background: barColor }} />
            {bar.label}: {fmtBar(bar.data[hovered])}
          </span>
          <span className="cf-dual__tip-row">
            <span className="cf-dual__swatch" style={{ background: lineColor }} />
            {line.label}: {fmtLine(line.data[hovered])}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
