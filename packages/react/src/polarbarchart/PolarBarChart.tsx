import { useState } from 'react';
import { arcPath, polar } from '../_charts/scale';
import type {
  PolarBarHoverPayload,
  PolarBarItem,
  PolarBarProps as BaseProps,
} from './variants';

export type PolarBarChartProps = BaseProps & {
  onHover?: (p: PolarBarHoverPayload | null) => void;
  onSelect?: (p: PolarBarHoverPayload) => void;
};

export function PolarBarChart(props: PolarBarChartProps) {
  const {
    items,
    size = 280,
    innerRatio = 0.35,
    sweep = 360,
    startAngle = 0,
    barColor,
    showLabels = true,
    format,
    ariaLabel,
    variant = 'md',
    onHover,
    onSelect,
  } = props;

  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 24;
  const rInner = rOuter * innerRatio;

  const max = Math.max(1, ...items.map((i) => i.value));
  const slice = sweep / Math.max(1, items.length);
  const gap = Math.min(2.2, slice * 0.12);

  const arc = (i: number, v: number): string => {
    const start = startAngle + slice * i + gap / 2;
    const end = startAngle + slice * (i + 1) - gap / 2;
    const ratio = Math.max(0, Math.min(1, v / max));
    const r = rInner + (rOuter - rInner) * ratio;
    return arcPath(cx, cy, r, rInner, start, end);
  };

  const labelPos = (i: number) => {
    const mid = startAngle + slice * (i + 0.5);
    return polar(cx, cy, rOuter + 12, mid);
  };

  const [hovered, setHovered] = useState<number | null>(null);
  const fmt = (v: number) => (format ? format(v) : v.toLocaleString());
  const colorFor = (it: PolarBarItem) => it.color ?? barColor ?? 'var(--accent-1)';

  return (
    <figure className={`cf-polar-bar cf-polar-bar--${variant}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-label={ariaLabel ?? '极坐标柱状图'} role="img">
        <g className="cf-polar-bar__grid">
          <circle cx={cx} cy={cy} r={rInner} className="cf-polar-bar__ring" />
          <circle cx={cx} cy={cy} r={rInner + (rOuter - rInner) * 0.5} className="cf-polar-bar__ring" />
          <circle cx={cx} cy={cy} r={rOuter} className="cf-polar-bar__ring" />
        </g>

        <g className="cf-polar-bar__bars">
          {items.map((it, i) => (
            <path
              key={i}
              d={arc(i, it.value)}
              fill={colorFor(it)}
              opacity={hovered === null || hovered === i ? 1 : 0.4}
              className="cf-polar-bar__bar"
              tabIndex={0}
              aria-label={`${it.label}: ${fmt(it.value)}`}
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

        {showLabels && (
          <g className="cf-polar-bar__labels">
            {items.map((it, i) => {
              const p = labelPos(i);
              return (
                <text key={`l-${i}`} x={p.x} y={p.y} className="cf-polar-bar__label" textAnchor="middle" dominantBaseline="middle">
                  {it.label}
                </text>
              );
            })}
          </g>
        )}
      </svg>
      {hovered !== null && (
        <figcaption className="cf-polar-bar__tip">
          <span className="cf-polar-bar__swatch" style={{ background: colorFor(items[hovered]) }} />
          <span className="cf-polar-bar__tip-label">{items[hovered].label}</span>
          <span className="cf-polar-bar__tip-value">{fmt(items[hovered].value)}</span>
        </figcaption>
      )}
    </figure>
  );
}
