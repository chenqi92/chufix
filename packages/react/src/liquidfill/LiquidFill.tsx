import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { LiquidFillProps } from './variants';

export function LiquidFill(props: LiquidFillProps) {
  const {
    value,
    width = 240,
    height = 240,
    amplitude = 6,
    wavelength = 0.6,
    speed = 0.4,
    waves = 2,
    shape = 'circle',
    label,
    ariaLabel,
    className,
  } = props;

  const [phase, setPhase] = useState(0);
  const lastRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    const tick = (t: number) => {
      if (!lastRef.current) lastRef.current = t;
      const dt = (t - lastRef.current) / 1000;
      lastRef.current = t;
      if (!reducedRef.current && speedRef.current > 0) {
        setPhase((p) => (p + speedRef.current * dt) % 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, []);

  const uid = useId().replace(/:/g, '');
  const clipId = `cflq-${uid}`;

  const clamped = Math.max(0, Math.min(1, value));
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 4;

  const layers = useMemo(() => {
    const out: { d: string; opacity: number }[] = [];
    const n = Math.max(1, Math.min(3, waves));
    const wl = width * wavelength;
    const yLevel = height * (1 - clamped);
    const step = 4;
    for (let layer = 0; layer < n; layer++) {
      const amp = amplitude * (1 - layer * 0.25);
      const offset = (phase + layer * 0.33) * wl * 2;
      let d = `M ${-amp} ${height}`;
      d += ` L ${-amp} ${yLevel}`;
      for (let x = -amp; x <= width + amp; x += step) {
        const ph = ((x + offset) / wl) * Math.PI * 2;
        const y = yLevel + Math.sin(ph) * amp;
        d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      d += ` L ${width + amp} ${height} Z`;
      out.push({ d, opacity: 0.85 - layer * 0.22 });
    }
    return out;
  }, [phase, waves, amplitude, wavelength, clamped, width, height]);

  const text = label ?? `${Math.round(clamped * 100)}%`;

  return (
    <svg
      className={['cf-chart cf-liquidfill', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel ?? `液体填充 ${Math.round(clamped * 100)}%`}
    >
      <defs>
        <clipPath id={clipId}>
          {shape === 'circle' ? (
            <circle cx={cx} cy={cy} r={radius} />
          ) : (
            <rect x={2} y={2} width={width - 4} height={height - 4} rx={8} />
          )}
        </clipPath>
      </defs>
      {shape === 'circle' ? (
        <circle className="cf-liquidfill__rim" cx={cx} cy={cy} r={radius} />
      ) : (
        <rect className="cf-liquidfill__rim" x={2} y={2} width={width - 4} height={height - 4} rx={8} />
      )}
      <g clipPath={`url(#${clipId})`}>
        <rect className="cf-liquidfill__bg" x={0} y={0} width={width} height={height} />
        {layers.map((wave, i) => (
          <path
            key={i}
            className={`cf-liquidfill__wave cf-liquidfill__wave--${i}`}
            d={wave.d}
            style={{ opacity: wave.opacity }}
          />
        ))}
      </g>
      <text x={cx} y={cy + 6} textAnchor="middle" className="cf-liquidfill__label">
        {text}
      </text>
    </svg>
  );
}
