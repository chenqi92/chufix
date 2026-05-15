/**
 * Module-singleton drag/drop coordinator.
 *
 * Coordinates cross-component DnD between Draggable / Droppable / DragLayer.
 * Self-contained components (Sortable, ReorderTable) use plain `useDrag` and
 * do NOT touch this store — they reorder local state without going through
 * any shared registry.
 *
 * IMPORTANT: per CLAUDE.md §9.1, consumers must import via the barrel
 * (`from '@chufix-design/vue'`) — deep `src/` imports create a second store
 * instance with its own listeners, making drops silently no-op.
 */

export interface DragPayload<T = unknown> {
  type: string;
  data: T;
}

export interface DragSnapshot {
  active: boolean;
  payload: DragPayload | null;
  source: HTMLElement | null;
  pointer: { x: number; y: number };
  origin: { x: number; y: number };
  over: HTMLElement | null;
  canDrop: boolean;
}

const initialState: DragSnapshot = {
  active: false,
  payload: null,
  source: null,
  pointer: { x: 0, y: 0 },
  origin: { x: 0, y: 0 },
  over: null,
  canDrop: false,
};

let state: DragSnapshot = { ...initialState };
const listeners = new Set<(s: DragSnapshot) => void>();

function emit() {
  for (const fn of listeners) fn(state);
}

export interface DroppableEntry {
  el: HTMLElement;
  accept: string[] | null;
  onDrop?: (payload: DragPayload, pointer: { x: number; y: number }) => void;
  onEnter?: (payload: DragPayload) => void;
  onLeave?: (payload: DragPayload) => void;
}

const droppables = new Map<HTMLElement, DroppableEntry>();

function findDroppableAt(x: number, y: number, type: string): DroppableEntry | null {
  if (typeof document === 'undefined') return null;
  const stack = document.elementsFromPoint(x, y);
  for (const el of stack) {
    let cur: Element | null = el;
    while (cur) {
      const entry = droppables.get(cur as HTMLElement);
      if (entry) {
        if (!entry.accept || entry.accept.includes(type)) return entry;
        return null;
      }
      cur = cur.parentElement;
    }
  }
  return null;
}

export const dndStore = {
  get: () => state,
  subscribe(fn: (s: DragSnapshot) => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  registerDroppable(entry: DroppableEntry): () => void {
    droppables.set(entry.el, entry);
    return () => {
      droppables.delete(entry.el);
    };
  },
  start(payload: DragPayload, source: HTMLElement, x: number, y: number) {
    state = {
      active: true,
      payload,
      source,
      pointer: { x, y },
      origin: { x, y },
      over: null,
      canDrop: false,
    };
    emit();
  },
  move(x: number, y: number) {
    if (!state.active || !state.payload) return;
    const hit = findDroppableAt(x, y, state.payload.type);
    const prev = state.over;
    const nextOver = hit?.el ?? null;
    if (prev !== nextOver) {
      if (prev) {
        const prevEntry = droppables.get(prev);
        prevEntry?.onLeave?.(state.payload);
      }
      if (hit) hit.onEnter?.(state.payload);
    }
    state = { ...state, pointer: { x, y }, over: nextOver, canDrop: !!hit };
    emit();
  },
  end() {
    if (!state.active || !state.payload) {
      state = { ...initialState };
      emit();
      return;
    }
    if (state.over) {
      const entry = droppables.get(state.over);
      entry?.onDrop?.(state.payload, state.pointer);
    } else {
      state.payload && (function () {
        // no-op; no drop target
      })();
    }
    const prevPayload = state.payload;
    const prevOver = state.over;
    state = { ...initialState };
    if (prevOver) {
      const entry = droppables.get(prevOver);
      entry?.onLeave?.(prevPayload);
    }
    emit();
  },
  cancel() {
    if (!state.active) return;
    if (state.over && state.payload) {
      const entry = droppables.get(state.over);
      entry?.onLeave?.(state.payload);
    }
    state = { ...initialState };
    emit();
  },
};
