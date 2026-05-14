import { useCallback, useRef, useState } from 'react';

export interface ClipboardApi {
  copied: boolean;
  supported: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Reactive `navigator.clipboard.writeText` wrapper.
 */
export function useClipboard(resetMs = 1500): ClipboardApi {
  const supported =
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function';
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    function flagSuccess() {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    }
    if (!supported) {
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
        if (ok) flagSuccess();
        return ok;
      } catch {
        return false;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flagSuccess();
      return true;
    } catch {
      return false;
    }
  }, [supported, resetMs]);

  return { copied, supported, copy };
}
