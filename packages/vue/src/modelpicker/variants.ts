export interface ModelOption {
  id: string;
  label: string;
  /** Provider/vendor slug: 'anthropic' / 'openai' / 'google' / 'local' / ... */
  provider?: string;
  /** Short capability badges, e.g. ['vision', 'thinking', '200k']. */
  capabilities?: string[];
  /** Context window in tokens. */
  contextWindow?: number;
  /** Cost per million tokens. */
  costPerMillion?: { input: number; output: number };
  /** Optional description shown under the label. */
  description?: string;
  disabled?: boolean;
}

export interface ModelPickerProps {
  options: ModelOption[];
  modelValue?: string;
  placeholder?: string;
  /** Group options under their provider name. Default true. */
  groupByProvider?: boolean;
  disabled?: boolean;
}

export function formatContextWindow(n: number | undefined): string {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export function groupOptions(options: ModelOption[], enabled: boolean): Array<{ provider: string; items: ModelOption[] }> {
  if (!enabled) return [{ provider: '', items: options }];
  const map = new Map<string, ModelOption[]>();
  for (const opt of options) {
    const p = opt.provider ?? '其他';
    if (!map.has(p)) map.set(p, []);
    map.get(p)!.push(opt);
  }
  return Array.from(map, ([provider, items]) => ({ provider, items }));
}
