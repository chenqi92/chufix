import { useEffect, useRef, type RefObject } from 'react';
import { dndStore, type DragPayload } from './dndStore';

export interface UseDraggableOptions {
  payload: DragPayload | (() => DragPayload);
  handle?: string;
  disabled?: boolean;
  threshold?: number;
  onStart?: () => void;
  onEnd?: (dropped: boolean) => void;
}

export function useDraggable(
  target: RefObject<HTMLElement | null>,
  options: UseDraggableOptions,
) {
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let active = false;
    let started = false;
    let startX = 0;
    let startY = 0;
    let pointerId = -1;

    function resolvePayload(): DragPayload {
      const p = optsRef.current.payload;
      return typeof p === 'function' ? p() : p;
    }
    function matchHandle(ev: PointerEvent): boolean {
      const sel = optsRef.current.handle;
      if (!sel) return true;
      const t = ev.target as Element | null;
      return !!(t && t.closest(sel));
    }
    function onDown(ev: PointerEvent) {
      if (ev.button !== undefined && ev.button !== 0) return;
      if (optsRef.current.disabled) return;
      if (!matchHandle(ev)) return;
      active = true;
      started = false;
      startX = ev.clientX;
      startY = ev.clientY;
      pointerId = ev.pointerId;
      try {
        el!.setPointerCapture(ev.pointerId);
      } catch {}
      el!.addEventListener('pointermove', onMove);
      el!.addEventListener('pointerup', onUp);
      el!.addEventListener('pointercancel', onCancel);
    }
    function onMove(ev: PointerEvent) {
      if (!active || ev.pointerId !== pointerId) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const threshold = optsRef.current.threshold ?? 4;
      if (!started) {
        if (Math.hypot(dx, dy) < threshold) return;
        started = true;
        dndStore.start(resolvePayload(), el!, ev.clientX, ev.clientY);
        optsRef.current.onStart?.();
      } else {
        dndStore.move(ev.clientX, ev.clientY);
      }
    }
    function onUp(ev: PointerEvent) {
      if (!active || ev.pointerId !== pointerId) return;
      const dropped = started && !!dndStore.get().over;
      stop();
      if (started) {
        dndStore.end();
        optsRef.current.onEnd?.(dropped);
      }
    }
    function onCancel(ev: PointerEvent) {
      if (!active || ev.pointerId !== pointerId) return;
      stop();
      if (started) {
        dndStore.cancel();
        optsRef.current.onEnd?.(false);
      }
    }
    function stop() {
      if (!active) return;
      active = false;
      started = false;
      try {
        el!.releasePointerCapture(pointerId);
      } catch {}
      el!.removeEventListener('pointermove', onMove);
      el!.removeEventListener('pointerup', onUp);
      el!.removeEventListener('pointercancel', onCancel);
    }

    el.addEventListener('pointerdown', onDown);
    return () => {
      stop();
      el.removeEventListener('pointerdown', onDown);
    };
  }, [target]);
}
