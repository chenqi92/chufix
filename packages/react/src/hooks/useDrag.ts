import { useEffect, useRef, type RefObject } from 'react';

export type DragAxis = 'x' | 'y' | 'both';

export interface DragState {
  /** Accumulated horizontal displacement since pointerdown (px). */
  dx: number;
  /** Accumulated vertical displacement since pointerdown (px). */
  dy: number;
  /** Horizontal velocity over the last ~100ms window (px/ms). */
  vx: number;
  /** Vertical velocity over the last ~100ms window (px/ms). */
  vy: number;
  /** Milliseconds since pointerdown. */
  duration: number;
  /** Pointer id from the originating event. */
  pointerId: number;
  /** Originating pointer event. */
  event: PointerEvent;
  /** Release pointer capture and abort. */
  cancel: () => void;
}

export interface DragOptions {
  /** Restrict tracked axis. Default 'both'. */
  axis?: DragAxis;
  /** Movement threshold before onStart fires (px). Default 4. */
  threshold?: number;
  /** Clamp displacement to {min, max} on the active axis (single-axis only). */
  bounds?: { min?: number; max?: number };
  /** Fires once movement exceeds `threshold`. */
  onStart?: (state: DragState) => void;
  /** Fires on every pointermove after onStart. */
  onMove?: (state: DragState) => void;
  /** Fires on pointerup / pointercancel / cancel(). */
  onEnd?: (state: DragState) => void;
}

/**
 * Pointer-capture drag base for sheets / swipe / sliders.
 * Set CSS `touch-action: none` on the target to opt out of native scroll
 * while dragging.
 */
export function useDrag(target: RefObject<HTMLElement | null>, options: DragOptions = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const axis = optionsRef.current.axis ?? 'both';
    const threshold = optionsRef.current.threshold ?? 4;

    let startX = 0;
    let startY = 0;
    let startedAt = 0;
    let active = false;
    let started = false;
    let pointerId = -1;
    let samples: { t: number; x: number; y: number }[] = [];

    function buildState(ev: PointerEvent): DragState {
      let dx = axis === 'y' ? 0 : ev.clientX - startX;
      let dy = axis === 'x' ? 0 : ev.clientY - startY;
      const bounds = optionsRef.current.bounds;
      if (bounds && axis !== 'both') {
        const { min, max } = bounds;
        if (axis === 'x') {
          if (typeof min === 'number') dx = Math.max(min, dx);
          if (typeof max === 'number') dx = Math.min(max, dx);
        } else {
          if (typeof min === 'number') dy = Math.max(min, dy);
          if (typeof max === 'number') dy = Math.min(max, dy);
        }
      }
      const now = performance.now();
      samples.push({ t: now, x: dx, y: dy });
      const cutoff = now - 100;
      while (samples.length > 2 && samples[0].t < cutoff) samples.shift();
      const oldest = samples[0];
      const span = now - oldest.t || 1;
      const vx = (dx - oldest.x) / span;
      const vy = (dy - oldest.y) / span;
      return {
        dx,
        dy,
        vx,
        vy,
        duration: now - startedAt,
        pointerId,
        event: ev,
        cancel: stop,
      };
    }

    function onPointerDown(ev: PointerEvent) {
      if (ev.button !== undefined && ev.button !== 0) return;
      active = true;
      started = false;
      startX = ev.clientX;
      startY = ev.clientY;
      startedAt = performance.now();
      pointerId = ev.pointerId;
      samples = [{ t: startedAt, x: 0, y: 0 }];
      try {
        el!.setPointerCapture(ev.pointerId);
      } catch {}
      el!.addEventListener('pointermove', onPointerMove);
      el!.addEventListener('pointerup', onPointerUp);
      el!.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(ev: PointerEvent) {
      if (!active || ev.pointerId !== pointerId) return;
      const state = buildState(ev);
      if (!started) {
        const moved =
          axis === 'x' ? Math.abs(state.dx) : axis === 'y' ? Math.abs(state.dy) : Math.hypot(state.dx, state.dy);
        if (moved < threshold) return;
        started = true;
        optionsRef.current.onStart?.(state);
      }
      optionsRef.current.onMove?.(state);
    }

    function onPointerUp(ev: PointerEvent) {
      if (!active || ev.pointerId !== pointerId) return;
      const state = buildState(ev);
      stop();
      if (started) optionsRef.current.onEnd?.(state);
    }

    function stop() {
      if (!active) return;
      active = false;
      try {
        el!.releasePointerCapture(pointerId);
      } catch {}
      el!.removeEventListener('pointermove', onPointerMove);
      el!.removeEventListener('pointerup', onPointerUp);
      el!.removeEventListener('pointercancel', onPointerUp);
    }

    el.addEventListener('pointerdown', onPointerDown);
    return () => {
      stop();
      el.removeEventListener('pointerdown', onPointerDown);
    };
  }, [target]);
}
