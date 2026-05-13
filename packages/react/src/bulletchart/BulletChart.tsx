import type { BulletChartProps } from './variants';

export function BulletChart(props: BulletChartProps) {
  const {
    value,
    target,
    max,
    bands = [],
    height = 20,
    label,
    ariaLabel,
    className,
    onClick,
    onItemEnter,
    onItemLeave,
  } = props;
  const payload = (e: unknown) => ({ value, target, max, nativeEvent: e });

  const segs: { x: number; w: number; tone: string }[] = [];
  let prev = 0;
  for (const b of bands) {
    const x = (prev / max) * 100;
    const end = Math.min(b.upTo, max);
    const w = ((end - prev) / max) * 100;
    segs.push({ x, w, tone: b.tone ?? 'default' });
    prev = end;
  }

  const valuePct = Math.min(100, (value / max) * 100);
  const targetPct = target == null ? null : (target / max) * 100;

  return (
    <div
      className={['cf-bullet', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel ?? label ?? '子弹图'}
    >
      {label ? <div className="cf-bullet__label">{label}</div> : null}
      <div
        className="cf-bullet__track"
        style={{ height: `${height}px` }}
        onClick={(e) => onClick?.(payload(e))}
        onPointerEnter={(e) => onItemEnter?.(payload(e))}
        onPointerLeave={(e) => onItemLeave?.(payload(e))}
      >
        {segs.map((s, i) => (
          <span
            key={i}
            className={`cf-bullet__band cf-bullet__band--${s.tone}`}
            style={{ left: `${s.x}%`, width: `${s.w}%` }}
          />
        ))}
        <span className="cf-bullet__value" style={{ width: `${valuePct}%` }} />
        {targetPct != null ? (
          <span
            className="cf-bullet__target"
            style={{ left: `${targetPct}%` }}
          />
        ) : null}
      </div>
    </div>
  );
}
