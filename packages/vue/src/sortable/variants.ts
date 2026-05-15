export type SortableAxis = 'x' | 'y';

export interface SortableReorderEvent<T = unknown> {
  from: number;
  to: number;
  items: T[];
}

export interface SortableItemSnapshot {
  rect: DOMRect;
  size: number;
}

export function getDragAxisSize(rect: DOMRect, axis: SortableAxis): number {
  return axis === 'y' ? rect.height : rect.width;
}

export function getDragAxisStart(rect: DOMRect, axis: SortableAxis): number {
  return axis === 'y' ? rect.top : rect.left;
}

export function snapshotItems(
  hostEl: HTMLElement,
  axis: SortableAxis,
): SortableItemSnapshot[] {
  const items = Array.from(hostEl.children) as HTMLElement[];
  return items.map((el) => {
    const rect = el.getBoundingClientRect();
    return { rect, size: getDragAxisSize(rect, axis) };
  });
}

export function findInsertIndex(
  snapshots: SortableItemSnapshot[],
  draggedIndex: number,
  pointerOffset: number,
  axis: SortableAxis,
): number {
  if (snapshots.length === 0) return 0;
  const draggedRect = snapshots[draggedIndex].rect;
  const start = getDragAxisStart(draggedRect, axis);
  const size = getDragAxisSize(draggedRect, axis);
  const center = start + pointerOffset + size / 2;
  let best = draggedIndex;
  let bestDist = Infinity;
  for (let i = 0; i < snapshots.length; i++) {
    const r = snapshots[i].rect;
    const c = getDragAxisStart(r, axis) + getDragAxisSize(r, axis) / 2;
    const d = Math.abs(c - center);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function shiftForIndex(
  index: number,
  draggedIndex: number,
  insertIndex: number,
  draggedSize: number,
): number {
  if (index === draggedIndex) return 0;
  if (draggedIndex < insertIndex) {
    if (index > draggedIndex && index <= insertIndex) return -draggedSize;
  } else if (draggedIndex > insertIndex) {
    if (index >= insertIndex && index < draggedIndex) return draggedSize;
  }
  return 0;
}
