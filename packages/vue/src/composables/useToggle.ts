import { ref, type Ref } from 'vue';

export interface ToggleApi {
  state: Ref<boolean>;
  toggle: () => void;
  set: (next: boolean) => void;
  on: () => void;
  off: () => void;
}

/**
 * Boolean ref with `toggle / set / on / off` helpers.
 *
 * @example
 * const { state: open, toggle, on, off } = useToggle();
 */
export function useToggle(initial = false): ToggleApi {
  const state = ref(initial);
  return {
    state,
    toggle: () => (state.value = !state.value),
    set: (next: boolean) => (state.value = next),
    on: () => (state.value = true),
    off: () => (state.value = false),
  };
}
