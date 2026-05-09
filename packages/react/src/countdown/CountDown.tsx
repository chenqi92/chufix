import { useEffect, useState } from 'react';
import {
  countDownClass,
  formatRemaining,
  targetMs,
  type CountDownProps,
} from './variants';

export function CountDown({
  target,
  format = 'HH:mm:ss',
  interval = 1000,
  size = 'md',
  className,
  onFinish,
  onChange,
}: CountDownProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tms = targetMs(target);
    if (!tms) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const tick = () => {
      const r = tms - Date.now();
      if (r <= 0) {
        setRemaining(0);
        onChange?.(0);
        onFinish?.();
        if (timer) clearInterval(timer);
      } else {
        setRemaining(r);
        onChange?.(r);
      }
    };
    tick();
    timer = setInterval(tick, interval);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [target, interval, onChange, onFinish]);

  const cls = countDownClass({ size, className });
  return <span className={cls}>{formatRemaining(remaining, format)}</span>;
}
