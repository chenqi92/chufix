import { useCallback, useState } from 'react';

export interface ToggleApi {
  state: boolean;
  toggle: () => void;
  set: (next: boolean) => void;
  on: () => void;
  off: () => void;
}

/**
 * Boolean state with `toggle / set / on / off` helpers.
 */
export function useToggle(initial = false): ToggleApi {
  const [state, setState] = useState(initial);
  return {
    state,
    toggle: useCallback(() => setState((v) => !v), []),
    set: useCallback((next: boolean) => setState(next), []),
    on: useCallback(() => setState(true), []),
    off: useCallback(() => setState(false), []),
  };
}
