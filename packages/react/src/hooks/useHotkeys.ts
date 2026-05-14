import { useEffect, useRef, type RefObject } from 'react';

type HotkeyHandler = (ev: KeyboardEvent) => void;
type HotkeyMap = Record<string, HotkeyHandler>;

function normalizeBinding(binding: string) {
  const parts = binding.toLowerCase().split('+').map((s) => s.trim());
  let key = '';
  let ctrl = false;
  let meta = false;
  let shift = false;
  let alt = false;
  let mod = false;
  for (const part of parts) {
    if (part === 'ctrl' || part === 'control') ctrl = true;
    else if (part === 'cmd' || part === 'meta') meta = true;
    else if (part === 'shift') shift = true;
    else if (part === 'alt' || part === 'option') alt = true;
    else if (part === 'mod') mod = true;
    else if (part) key = part;
  }
  return { key, ctrl, meta, shift, alt, mod };
}

function matches(ev: KeyboardEvent, parsed: ReturnType<typeof normalizeBinding>) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const wantsCtrl = parsed.mod ? !isMac || parsed.ctrl : parsed.ctrl;
  const wantsMeta = parsed.mod ? isMac || parsed.meta : parsed.meta;
  const keyMatch =
    ev.key.toLowerCase() === parsed.key || (parsed.key === 'esc' && ev.key === 'Escape');
  return (
    keyMatch &&
    ev.ctrlKey === wantsCtrl &&
    ev.metaKey === wantsMeta &&
    ev.shiftKey === parsed.shift &&
    ev.altKey === parsed.alt
  );
}

export interface HotkeysOptions {
  target?: EventTarget | RefObject<EventTarget | null>;
  ignoreInputs?: boolean;
  preventDefault?: boolean;
}

/**
 * Register keyboard shortcuts. Auto-cleans up on unmount.
 *
 * @example
 * useHotkeys({
 *   'mod+s': (ev) => save(),
 *   'esc': () => close(),
 * });
 */
export function useHotkeys(map: HotkeyMap, options: HotkeysOptions = {}) {
  const mapRef = useRef(map);
  mapRef.current = map;
  const ignoreInputs = options.ignoreInputs ?? true;
  const preventDefault = options.preventDefault ?? true;

  useEffect(() => {
    const target =
      (options.target && 'current' in options.target
        ? options.target.current
        : options.target) ??
      (typeof window !== 'undefined' ? window : null);
    if (!target) return;

    function onKey(raw: Event) {
      const ev = raw as KeyboardEvent;
      if (ignoreInputs) {
        const el = ev.target as HTMLElement | null;
        if (
          el &&
          (el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.tagName === 'SELECT' ||
            el.isContentEditable)
        ) {
          if (!ev.ctrlKey && !ev.metaKey && ev.key !== 'Escape') return;
        }
      }
      for (const [binding, fn] of Object.entries(mapRef.current)) {
        const parsed = normalizeBinding(binding);
        if (matches(ev, parsed)) {
          if (preventDefault) ev.preventDefault();
          fn(ev);
          return;
        }
      }
    }
    target.addEventListener('keydown', onKey);
    return () => target.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.target, ignoreInputs, preventDefault]);
}
