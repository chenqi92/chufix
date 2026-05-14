import { useCallback, useEffect, useState } from 'react';

export interface StorageOptions<T> {
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
  sync?: boolean;
}

function buildStorage<T>(
  area: Storage | null,
  key: string,
  initial: T,
  options: StorageOptions<T>,
): [T, (value: T) => void] {
  const serialize = options.serialize ??
    (((v: T) => (typeof v === 'string' ? (v as string) : JSON.stringify(v))) as (v: T) => string);
  const deserialize =
    options.deserialize ??
    ((raw: string) => {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    });

  const read = (): T => {
    if (!area) return initial;
    const raw = area.getItem(key);
    if (raw == null) return initial;
    try {
      return deserialize(raw);
    } catch {
      return initial;
    }
  };

  const [value, setValue] = useState<T>(read);

  const write = useCallback(
    (next: T) => {
      setValue(next);
      if (!area) return;
      try {
        if (next == null) area.removeItem(key);
        else area.setItem(key, serialize(next));
      } catch {
        /* quota */
      }
    },
    [area, key, serialize],
  );

  // Cross-tab sync for localStorage.
  useEffect(() => {
    if (!area || typeof window === 'undefined') return;
    if (area !== window.localStorage) return;
    if (options.sync === false) return;
    const onStorage = (ev: StorageEvent) => {
      if (ev.key !== key) return;
      if (ev.newValue == null) {
        setValue(initial);
      } else {
        try {
          setValue(deserialize(ev.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, key]);

  return [value, write];
}

export function useLocalStorage<T>(
  key: string,
  initial: T,
  options: StorageOptions<T> = {},
): [T, (value: T) => void] {
  const area = typeof window !== 'undefined' ? window.localStorage : null;
  return buildStorage(area, key, initial, options);
}

export function useSessionStorage<T>(
  key: string,
  initial: T,
  options: StorageOptions<T> = {},
): [T, (value: T) => void] {
  const area = typeof window !== 'undefined' ? window.sessionStorage : null;
  return buildStorage(area, key, initial, { ...options, sync: false });
}
