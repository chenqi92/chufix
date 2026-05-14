import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useDrag } from '../hooks/useDrag';
import type { SwipeActionItem, SwipeActionProps } from './variants';

export function SwipeAction(props: SwipeActionProps) {
  const {
    left = [],
    right = [],
    threshold = 24,
    closeOnOutsideTap = true,
    disabled = false,
    onAction,
    onOpen,
    onClose,
    children,
  } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const leftRailRef = useRef<HTMLDivElement | null>(null);
  const rightRailRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [opened, setOpened] = useState<'none' | 'left' | 'right'>('none');
  const draggingRef = useRef(false);
  const [, force] = useState(0);

  const widthsRef = useRef({ left: 0, right: 0 });
  function measure() {
    widthsRef.current = {
      left: leftRailRef.current?.offsetWidth ?? 0,
      right: rightRailRef.current?.offsetWidth ?? 0,
    };
  }
  useEffect(measure, []);

  useDrag(contentRef, {
    axis: 'x',
    onStart() {
      if (disabled) return;
      measure();
      draggingRef.current = true;
      force((n) => n + 1);
    },
    onMove(s) {
      if (disabled) return;
      const { left: lw, right: rw } = widthsRef.current;
      const base = opened === 'left' ? lw : opened === 'right' ? -rw : 0;
      const next = base + s.dx;
      setOffset(Math.max(-rw, Math.min(lw, next)));
    },
    onEnd(s) {
      if (disabled) return;
      draggingRef.current = false;
      const { left: lw, right: rw } = widthsRef.current;
      const fastRight = s.vx > 0.3;
      const fastLeft = s.vx < -0.3;
      if (offset > lw / 2 || (fastRight && lw > 0)) {
        setOffset(lw);
        if (opened !== 'left') {
          setOpened('left');
          onOpen?.('left');
        }
      } else if (offset < -rw / 2 || (fastLeft && rw > 0)) {
        setOffset(-rw);
        if (opened !== 'right') {
          setOpened('right');
          onOpen?.('right');
        }
      } else {
        if (opened !== 'none') onClose?.();
        setOffset(0);
        setOpened('none');
      }
    },
  });

  useEffect(() => {
    if (!closeOnOutsideTap) return;
    function onDoc(e: PointerEvent) {
      if (opened === 'none' || draggingRef.current) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOffset(0);
        setOpened('none');
        onClose?.();
      }
    }
    document.addEventListener('pointerdown', onDoc, true);
    return () => document.removeEventListener('pointerdown', onDoc, true);
  }, [closeOnOutsideTap, opened, onClose]);

  function handleAction(item: SwipeActionItem) {
    item.onClick?.();
    onAction?.(item.key, item);
    setOffset(0);
    setOpened('none');
  }

  const contentStyle: CSSProperties = {
    transform: `translateX(${offset}px)`,
    transition: draggingRef.current ? 'none' : undefined,
  };

  const toneClass = (tone?: string) =>
    tone && tone !== 'default' ? `cf-swipeaction__btn--${tone}` : '';

  return (
    <div ref={rootRef} className="cf-swipeaction" data-disabled={disabled || undefined}>
      {left.length > 0 && (
        <div ref={leftRailRef} className="cf-swipeaction__rail cf-swipeaction__rail--left" aria-hidden>
          {left.map((item) => (
            <button
              key={item.key}
              type="button"
              className={['cf-swipeaction__btn', toneClass(item.tone)].filter(Boolean).join(' ')}
              onClick={() => handleAction(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <div ref={contentRef} className="cf-swipeaction__content" style={contentStyle}>
        {children}
      </div>
      {right.length > 0 && (
        <div ref={rightRailRef} className="cf-swipeaction__rail cf-swipeaction__rail--right" aria-hidden>
          {right.map((item) => (
            <button
              key={item.key}
              type="button"
              className={['cf-swipeaction__btn', toneClass(item.tone)].filter(Boolean).join(' ')}
              onClick={() => handleAction(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
