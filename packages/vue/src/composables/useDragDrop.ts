import { onBeforeUnmount, reactive } from 'vue';
import { dndStore, type DragSnapshot } from './dndStore';

/**
 * Subscribe to the global DnD coordinator. Returned object is reactive and
 * tracks the live drag state (active, payload, pointer, over, canDrop).
 * Use this to build custom drag-layer overlays or status indicators.
 */
export function useDragDrop() {
  const state = reactive<DragSnapshot>({ ...dndStore.get() });
  const unsub = dndStore.subscribe((s) => {
    state.active = s.active;
    state.payload = s.payload;
    state.source = s.source;
    state.pointer = s.pointer;
    state.origin = s.origin;
    state.over = s.over;
    state.canDrop = s.canDrop;
  });
  onBeforeUnmount(unsub);
  return state;
}
