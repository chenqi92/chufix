import { Sparkline } from '../sparkline/Sparkline';
import type { MetricCardProps } from './variants';

export function MetricCard(props: MetricCardProps) {
  const { label, value, unit, delta, trend, deltaFn, ariaLabel, className } =
    props;

  const deltaText = (() => {
    if (delta == null) return '';
    if (deltaFn) return deltaFn(delta);
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}%`;
  })();

  const deltaTone =
    delta == null
      ? 'neutral'
      : delta > 0
      ? 'positive'
      : delta < 0
      ? 'negative'
      : 'neutral';

  return (
    <article
      className={['cf-metric', className].filter(Boolean).join(' ')}
      role="figure"
      aria-label={ariaLabel ?? label}
    >
      <header className="cf-metric__head">
        <span className="cf-metric__label">{label}</span>
        {delta != null ? (
          <span className={`cf-metric__delta cf-metric__delta--${deltaTone}`}>
            {deltaText}
          </span>
        ) : null}
      </header>
      <div className="cf-metric__value">
        <span className="cf-metric__num">{value}</span>
        {unit ? <span className="cf-metric__unit">{unit}</span> : null}
      </div>
      {trend && trend.length ? (
        <Sparkline
          data={trend}
          width={120}
          height={32}
          filled
          smooth
          className="cf-metric__trend"
        />
      ) : null}
    </article>
  );
}
