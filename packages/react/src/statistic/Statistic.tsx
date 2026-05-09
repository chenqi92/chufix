import { useEffect, useRef, useState } from 'react';
import {
  formatCountdown,
  formatNumber,
  statisticClass,
  type StatisticProps,
} from './variants';

export function Statistic(props: StatisticProps) {
  const {
    value,
    precision = 0,
    prefix,
    suffix,
    separator = ',',
    decimal = '.',
    duration = 800,
    countdown,
    format = 'HH:mm:ss',
    size = 'md',
    loading = false,
    label,
    className,
    onFinish,
  } = props;

  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearAnim() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  useEffect(() => {
    clearAnim();
    if (countdown != null) {
      const targetMs = countdown instanceof Date ? countdown.getTime() : countdown;
      const update = () => {
        const remaining = targetMs - Date.now();
        if (remaining <= 0) {
          setDisplay(0);
          onFinish?.();
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return;
        }
        setDisplay(remaining);
      };
      update();
      timerRef.current = setInterval(update, 1000);
    } else if (value != null) {
      if (duration <= 0) {
        setDisplay(value);
      } else {
        const start = display || 0;
        const change = value - start;
        const startTime = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(start + change * eased);
          if (t < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
      }
    }
    return clearAnim;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, countdown, duration]);

  const text = loading
    ? '—'
    : countdown != null
      ? formatCountdown(display, format)
      : formatNumber(display, precision, separator, decimal);

  return (
    <div className={statisticClass({ size, className })}>
      {label ? <div className="cf-statistic__label">{label}</div> : null}
      <div className="cf-statistic__value">
        {prefix ? <span className="cf-statistic__prefix">{prefix}</span> : null}
        <span className="cf-statistic__number">{text}</span>
        {suffix ? <span className="cf-statistic__suffix">{suffix}</span> : null}
      </div>
    </div>
  );
}
