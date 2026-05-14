import { type Ref } from 'vue';
import { useDrag, type DragState } from './useDrag';

type MaybeRef<T> = T | Ref<T>;

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface SwipeOptions {
  /** Minimum distance (px) on dominant axis to count as a swipe. Default 32. */
  threshold?: number;
  /** Minimum release velocity (px/ms) to count as a swipe even if distance is small. Default 0.3. */
  velocity?: number;
  /** Restrict to one axis. Default 'both'. */
  axis?: 'x' | 'y' | 'both';
  onSwipe?: (dir: SwipeDirection, state: DragState) => void;
}

/**
 * Pointer-based 4-direction swipe detector built on top of {@link useDrag}.
 * Fires `onSwipe` once at the end of a gesture if either the displacement
 * or release velocity exceeds the configured thresholds on the dominant axis.
 */
export function useSwipe(target: MaybeRef<HTMLElement | null>, options: SwipeOptions = {}) {
  const threshold = options.threshold ?? 32;
  const velocity = options.velocity ?? 0.3;
  const axis = options.axis ?? 'both';

  return useDrag(target, {
    axis,
    onEnd(state) {
      const absX = Math.abs(state.dx);
      const absY = Math.abs(state.dy);
      const horizontal = axis === 'y' ? false : axis === 'x' ? true : absX >= absY;
      if (horizontal) {
        if (absX < threshold && Math.abs(state.vx) < velocity) return;
        options.onSwipe?.(state.dx > 0 ? 'right' : 'left', state);
      } else {
        if (absY < threshold && Math.abs(state.vy) < velocity) return;
        options.onSwipe?.(state.dy > 0 ? 'down' : 'up', state);
      }
    },
  });
}
