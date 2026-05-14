import { ref, watch, type Ref } from 'vue';

export interface StorageOptions<T> {
  /** Custom serializer. Default JSON.stringify/parse with a string passthrough. */
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
  /** Listen for `storage` events from other tabs. Default true. */
  sync?: boolean;
}

function buildStorage<T>(
  area: Storage | null,
  key: string,
  initial: T,
  options: StorageOptions<T>,
): Ref<T> {
  const serialize = options.serialize ?? (((v: T) =>
    typeof v === 'string' ? (v as string) : JSON.stringify(v)) as (v: T) => string);
  const deserialize = options.deserialize ??
    ((raw: string) => {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    });

  const stored = (() => {
    if (!area) return initial;
    const raw = area.getItem(key);
    if (raw == null) return initial;
    try {
      return deserialize(raw);
    } catch {
      return initial;
    }
  })();

  const state = ref(stored) as Ref<T>;

  watch(
    state,
    (value) => {
      if (!area) return;
      try {
        if (value == null) area.removeItem(key);
        else area.setItem(key, serialize(value));
      } catch {
        /* quota / SecurityError */
      }
    },
    { deep: true },
  );

  if (options.sync !== false && typeof window !== 'undefined' && area === window.localStorage) {
    window.addEventListener('storage', (ev) => {
      if (ev.key !== key) return;
      if (ev.newValue == null) state.value = initial;
      else {
        try {
          state.value = deserialize(ev.newValue);
        } catch {
          /* ignore parse */
        }
      }
    });
  }

  return state;
}

/**
 * Reactive `localStorage` ref. Auto JSON-serializes non-string values.
 * Cross-tab sync via the `storage` event by default.
 *
 * @example
 * const theme = useLocalStorage('chufix.theme', 'dark-cool');
 * theme.value = 'light'; // writes through to localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
  options: StorageOptions<T> = {},
): Ref<T> {
  const area = typeof window !== 'undefined' ? window.localStorage : null;
  return buildStorage(area, key, initial, options);
}

/**
 * Reactive `sessionStorage` ref. Same shape as useLocalStorage but session-scoped.
 */
export function useSessionStorage<T>(
  key: string,
  initial: T,
  options: StorageOptions<T> = {},
): Ref<T> {
  const area = typeof window !== 'undefined' ? window.sessionStorage : null;
  return buildStorage(area, key, initial, { ...options, sync: false });
}
