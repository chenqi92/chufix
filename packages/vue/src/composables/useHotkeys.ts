import { onBeforeUnmount, onMounted, unref, type Ref } from 'vue';

type MaybeRef<T> = T | Ref<T>;
type HotkeyHandler = (ev: KeyboardEvent) => void;
type HotkeyMap = Record<string, HotkeyHandler>;

/**
 * Parse a binding like "mod+k", "shift+enter", "ctrl+shift+s", "esc" into
 * a normalized form. `mod` = `meta` on macOS, `ctrl` elsewhere.
 */
function normalizeBinding(binding: string): {
  key: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  mod: boolean;
} {
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

function matches(ev: KeyboardEvent, parsed: ReturnType<typeof normalizeBinding>): boolean {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const wantsCtrl = parsed.mod ? !isMac || parsed.ctrl : parsed.ctrl;
  const wantsMeta = parsed.mod ? isMac || parsed.meta : parsed.meta;
  const keyMatch = ev.key.toLowerCase() === parsed.key || (parsed.key === 'esc' && ev.key === 'Escape');
  if (!keyMatch) return false;
  if (ev.ctrlKey !== wantsCtrl) return false;
  if (ev.metaKey !== wantsMeta) return false;
  if (ev.shiftKey !== parsed.shift) return false;
  if (ev.altKey !== parsed.alt) return false;
  return true;
}

export interface HotkeysOptions {
  /** Target to attach to. Default `window`. */
  target?: MaybeRef<EventTarget | null | undefined>;
  /** Skip hotkeys while focus is in an input/textarea/contenteditable. Default true. */
  ignoreInputs?: boolean;
  /** preventDefault on match. Default true. */
  preventDefault?: boolean;
}

/**
 * Register one or more keyboard shortcuts. Auto-cleans up on unmount.
 *
 * @example
 * useHotkeys({
 *   'mod+s': (ev) => save(),
 *   'mod+shift+p': (ev) => openPalette(),
 *   'esc': () => close(),
 * });
 */
export function useHotkeys(map: HotkeyMap, options: HotkeysOptions = {}): () => void {
  const ignoreInputs = options.ignoreInputs ?? true;
  const preventDefault = options.preventDefault ?? true;
  const parsedMap = Object.entries(map).map(([binding, handler]) => ({
    parsed: normalizeBinding(binding),
    handler,
  }));

  function handler(ev: KeyboardEvent) {
    if (ignoreInputs) {
      const el = ev.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT' ||
          el.isContentEditable)
      ) {
        // Allow Escape & mod-combos even inside inputs (typical app behavior).
        if (!ev.ctrlKey && !ev.metaKey && ev.key !== 'Escape') return;
      }
    }
    for (const { parsed, handler: fn } of parsedMap) {
      if (matches(ev, parsed)) {
        if (preventDefault) ev.preventDefault();
        fn(ev);
        return;
      }
    }
  }

  let attached: EventTarget | null = null;
  function attach() {
    const t = unref(options.target ?? null) ?? (typeof window !== 'undefined' ? window : null);
    if (!t) return;
    detach();
    t.addEventListener('keydown', handler as EventListener);
    attached = t;
  }
  function detach() {
    if (attached) {
      attached.removeEventListener('keydown', handler as EventListener);
      attached = null;
    }
  }

  onMounted(attach);
  onBeforeUnmount(detach);
  return detach;
}
