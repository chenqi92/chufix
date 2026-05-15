import { useSyncExternalStore } from 'react';
import { dndStore, type DragSnapshot } from './dndStore';

/**
 * Subscribe to the global DnD coordinator. Returns the live drag snapshot —
 * use it to render custom drag-layer overlays or status indicators.
 */
export function useDragDrop(): DragSnapshot {
  return useSyncExternalStore(
    (fn) => dndStore.subscribe(fn),
    () => dndStore.get(),
    () => dndStore.get(),
  );
}
