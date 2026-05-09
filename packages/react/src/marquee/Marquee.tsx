import { marqueeClass, type MarqueeProps } from './variants';

export function Marquee({
  content,
  children,
  duration = 20,
  direction = 'left',
  pauseOnHover = true,
  gap = 40,
  className,
}: MarqueeProps) {
  const cls = marqueeClass({ direction, pauseOnHover, className });
  const trackStyle = { animationDuration: `${duration}s`, gap: `${gap}px` };
  const inner = children ?? content ?? null;
  return (
    <div className={cls}>
      <div className="cf-marquee__track" style={trackStyle}>
        <div className="cf-marquee__group">{inner}</div>
        <div className="cf-marquee__group" aria-hidden="true">{inner}</div>
      </div>
    </div>
  );
}
