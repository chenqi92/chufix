import { useEffect, useRef, useState } from 'react';
import { useSwipe } from '../hooks/useSwipe';
import { carouselClass, type CarouselProps } from './variants';

export function Carousel(props: CarouselProps) {
  const {
    items,
    value,
    defaultValue = 0,
    autoplay = false,
    interval = 4000,
    loop = true,
    controls = true,
    indicators = true,
    size = 'md',
    className,
    onChange,
    renderItem,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? (value as number) : internal;
  const total = items.length;
  const hoveredRef = useRef(false);

  function go(index: number) {
    if (total === 0) return;
    let next = index;
    if (loop) next = ((index % total) + total) % total;
    else next = Math.max(0, Math.min(total - 1, index));
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      if (!hoveredRef.current) {
        const next = loop ? (current + 1) % total : Math.min(total - 1, current + 1);
        if (next !== current) {
          if (!isControlled) setInternal(next);
          onChange?.(next);
        }
      }
    }, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, interval, current, total, loop, isControlled]);

  const cls = carouselClass({ size, className });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  useSwipe(viewportRef, {
    axis: 'x',
    onSwipe(dir) {
      if (dir === 'left') go(current + 1);
      else if (dir === 'right') go(current - 1);
    },
  });

  return (
    <div
      className={cls}
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
    >
      <div ref={viewportRef} className="cf-carousel__viewport">
        <div className="cf-carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((item, i) => (
            <div key={item.key ?? i} className="cf-carousel__slide">
              {renderItem
                ? renderItem(item, i)
                : item.src
                  ? <img src={item.src} alt={item.alt ?? ''} />
                  : null}
            </div>
          ))}
        </div>
      </div>

      {controls && total > 1 ? (
        <>
          <button
            type="button"
            className="cf-carousel__control cf-carousel__control--prev"
            aria-label="上一项"
            disabled={!loop && current === 0}
            onClick={() => go(current - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="cf-carousel__control cf-carousel__control--next"
            aria-label="下一项"
            disabled={!loop && current === total - 1}
            onClick={() => go(current + 1)}
          >
            ›
          </button>
        </>
      ) : null}

      {indicators && total > 1 ? (
        <div className="cf-carousel__indicators">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`cf-carousel__indicator${i === current ? ' is-active' : ''}`}
              aria-label={`第 ${i + 1} 项`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
