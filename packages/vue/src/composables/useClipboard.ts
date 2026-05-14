import { ref, type Ref } from 'vue';

export interface ClipboardApi {
  copied: Ref<boolean>;
  supported: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Wrap `navigator.clipboard.writeText` with reactive feedback.
 * `copied` flips to true on success and back to false after `resetMs`.
 *
 * @example
 * const { copy, copied } = useClipboard();
 * <button @click="copy('hi')">{{ copied ? '已复制' : '复制' }}</button>
 */
export function useClipboard(resetMs = 1500): ClipboardApi {
  const supported =
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function';
  const copied = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function copy(text: string): Promise<boolean> {
    if (!supported) {
      // Legacy fallback: create a textarea + execCommand('copy').
      if (typeof document === 'undefined') return false;
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) {
          copied.value = true;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => (copied.value = false), resetMs);
        }
        return ok;
      } catch {
        return false;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (copied.value = false), resetMs);
      return true;
    } catch {
      return false;
    }
  }

  return { copied, supported, copy };
}
