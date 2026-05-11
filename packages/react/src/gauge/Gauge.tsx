import { useMemo } from 'react';
import { polar } from '../_charts/scale';
import type { GaugeProps } from './variants';

export function Gauge(props: GaugeProps) {
  const {
    value,
    min = 0,
    max = 100,
    size = 160,
    thickness = 10,
    sweep = 270,
    label,
    unit,
    tone = 'accent',
    ariaLabel,
    className,
  } = props;

  const layout = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - thickness / 2 - 2;
    const startAngle = -sweep / 2;
    const endAngle = sweep / 2;
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const trackStart = polar(cx, cy, r, startAngle);
    const trackEnd = polar(cx, cy, r, endAngle);
    const valueAngle = startAngle + ratio * sweep;
    const valueEnd = polar(cx, cy, r, valueAngle);
    const largeTrack = sweep > 180 ? 1 : 0;
    const largeValue = ratio * sweep > 180 ? 1 : 0;
    const trackPath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeTrack} 1 ${trackEnd.x} ${trackEnd.y}`;
    const valuePath = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeValue} 1 ${valueEnd.x} ${valueEnd.y}`;
    return { cx, cy, trackPath, valuePath };
  }, [value, min, max, size, thickness, sweep]);

  const toneColor = {
    success: 'var(--status-success)',
    warning: 'var(--status-warning)',
    error: 'var(--status-error)',
    accent: 'var(--accent-1)',
  }[tone];

  return (
    <svg
      className={['cf-chart cf-gauge', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={ariaLabel ?? label ?? '仪表盘'}
    >
      <path
        className="cf-gauge__track"
        d={layout.trackPath}
        strokeWidth={thickness}
      />
      <path
        className="cf-gauge__fill"
        d={layout.valuePath}
        stroke={toneColor}
        strokeWidth={thickness}
      />
      <text className="cf-gauge__label" x={layout.cx} y={layout.cy}>
        {Math.round(value)}
        {unit ? <tspan className="cf-gauge__unit">{unit}</tspan> : null}
      </text>
      {label ? (
        <text
          x={layout.cx}
          y={layout.cy + 24}
          textAnchor="middle"
          className="cf-gauge__caption"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
