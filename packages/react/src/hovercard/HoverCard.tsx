import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HoverCardPlacement, HoverCardProps } from './variants';

function computePosition(
  rect: DOMRect,
  cw: number,
  ch: number,
  placement: HoverCardPlacement,
) {
  const gap = 8;
  switch (placement) {
    case 'top':
      return {
        top: rect.top - ch - gap + window.scrollY,
        left: rect.left + rect.width / 2 - cw / 2 + window.scrollX,
      };
    case 'bottom':
      return {
        top: rect.bottom + gap + window.scrollY,
        left: rect.left + rect.width / 2 - cw / 2 + window.scrollX,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - ch / 2 + window.scrollY,
        left: rect.left - cw - gap + window.scrollX,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2 - ch / 2 + window.scrollY,
        left: rect.right + gap + window.scrollX,
      };
  }
}

export function HoverCard(props: HoverCardProps) {
  const {
    placement = 'bottom',
    size = 'md',
    openDelay = 700,
    closeDelay = 200,
    disabled = false,
    container,
    trigger,
    children,
  } = props;

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current != null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = () => {
    if (disabled) return;
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), openDelay);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cw = cardRef.current?.offsetWidth ?? 280;
    const ch = cardRef.current?.offsetHeight ?? 120;
    setPos(computePosition(rect, cw, ch, placement));
  }, [open, placement]);

  useEffect(() => () => clearTimers(), []);

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);

  return (
    <>
      <span
        ref={triggerRef}
        className="cf-hovercard__trigger"
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
      >
        {trigger}
      </span>
      {open && target
        ? createPortal(
            <div
              ref={cardRef}
              role="dialog"
              className={`cf-hovercard cf-hovercard--${placement} cf-hovercard--${size}`}
              style={{ top: pos.top, left: pos.left }}
              onMouseEnter={clearTimers}
              onMouseLeave={scheduleClose}
            >
              {children}
            </div>,
            target,
          )
        : null}
    </>
  );
}
