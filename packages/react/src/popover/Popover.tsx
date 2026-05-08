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
  computePopoverPosition,
  type PopoverPlacement,
  type PopoverProps,
} from './variants';

const ANIMATION_MS = 140;

export function Popover(props: PopoverProps) {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom',
    trigger = 'click',
    offset = 8,
    closeOnOutside = true,
    closeOnEsc = true,
    width,
    disabled = false,
    content,
    children,
  } = props;

  const controlled = open !== undefined;
  const [inner, setInner] = useState(defaultOpen);
  const visible = controlled ? !!open : inner;

  const setVisible = useCallback(
    (v: boolean) => {
      if (!controlled) setInner(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(visible);
  const [state, setState] = useState<'open' | 'closed'>(visible ? 'open' : 'closed');
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    placement: PopoverPlacement;
  }>({ top: 0, left: 0, placement });

  const clearHoverTimers = useCallback(() => {
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverOpenTimer.current = null;
    hoverCloseTimer.current = null;
  }, []);

  useLayoutEffect(() => {
    if (visible) {
      setMounted(true);
      const id = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(id);
    }
    if (mounted) {
      setState('closed');
      const t = setTimeout(() => setMounted(false), ANIMATION_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [visible, mounted]);

  const reposition = useCallback(() => {
    if (!triggerRef.current || !panelRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const pw = panelRef.current.offsetWidth;
    const ph = panelRef.current.offsetHeight;
    setPos(computePopoverPosition(tRect, pw, ph, placement, offset));
  }, [placement, offset]);

  useLayoutEffect(() => {
    if (!mounted || state !== 'open') return;
    reposition();
  }, [mounted, state, reposition]);

  useEffect(() => {
    if (!mounted || state !== 'open') return;
    function onDocClick(e: MouseEvent) {
      if (!closeOnOutside) return;
      if (trigger === 'manual') return;
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setVisible(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && closeOnEsc) setVisible(false);
    }
    document.addEventListener('mousedown', onDocClick, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('mousedown', onDocClick, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [mounted, state, closeOnOutside, closeOnEsc, trigger, reposition, setVisible]);

  useEffect(() => () => clearHoverTimers(), [clearHoverTimers]);

  function onTriggerClick() {
    if (disabled) return;
    if (trigger !== 'click') return;
    setVisible(!visible);
  }

  function onTriggerEnter() {
    if (disabled) return;
    if (trigger !== 'hover') return;
    clearHoverTimers();
    hoverOpenTimer.current = setTimeout(() => setVisible(true), 100);
  }
  function onTriggerLeave() {
    if (trigger !== 'hover') return;
    clearHoverTimers();
    hoverCloseTimer.current = setTimeout(() => setVisible(false), 120);
  }
  function onPanelEnter() {
    if (trigger !== 'hover') return;
    clearHoverTimers();
  }
  function onPanelLeave() {
    if (trigger !== 'hover') return;
    clearHoverTimers();
    hoverCloseTimer.current = setTimeout(() => setVisible(false), 120);
  }

  const panelStyle: CSSProperties = {
    top: pos.top,
    left: pos.left,
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="cf-popover-trigger"
        onClick={onTriggerClick}
        onMouseEnter={onTriggerEnter}
        onMouseLeave={onTriggerLeave}
      >
        {children}
      </span>
      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              className={`cf-popover cf-popover--${pos.placement}`}
              data-state={state}
              role="dialog"
              style={panelStyle}
              onMouseEnter={onPanelEnter}
              onMouseLeave={onPanelLeave}
            >
              {content}
              <span className="cf-popover__arrow" />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
