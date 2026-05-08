import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import {
  computeTooltipPosition,
  type TooltipPlacement,
  type TooltipProps,
} from './variants';

export function Tooltip(props: TooltipProps) {
  const {
    content,
    placement = 'top',
    delay = 100,
    hideDelay = 80,
    disabled = false,
    offset = 8,
    maxWidth,
    children,
  } = props;

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    placement: TooltipPlacement;
  }>({ top: 0, left: 0, placement });

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const show = useCallback(() => {
    if (disabled || !content) return;
    clearTimers();
    openTimer.current = setTimeout(() => {
      setMounted(true);
      setOpen(true);
    }, delay);
  }, [disabled, content, delay, clearTimers]);

  const hide = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setTimeout(() => setMounted(false), 120);
    }, hideDelay);
  }, [hideDelay, clearTimers]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    if (!triggerRef.current || !tipRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const tw = tipRef.current.offsetWidth;
    const th = tipRef.current.offsetHeight;
    setPos(computeTooltipPosition(tRect, tw, th, placement, offset));
  }, [open, mounted, placement, offset, content]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const tipStyle: CSSProperties = {
    top: pos.top,
    left: pos.left,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="ck-tooltip-trigger"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={tipRef}
              className={`ck-tooltip ck-tooltip--${pos.placement}`}
              data-state={open ? 'open' : 'closed'}
              role="tooltip"
              style={tipStyle}
            >
              {content}
              <span className="ck-tooltip__arrow" />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
