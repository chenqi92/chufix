export interface ModelOption {
  id: string;
  label: string;
  provider?: string;
  capabilities?: string[];
  contextWindow?: number;
  costPerMillion?: { input: number; output: number };
  description?: string;
  disabled?: boolean;
}

export interface ModelPickerProps {
  options: ModelOption[];
  value?: string;
  onChange?: (id: string, option: ModelOption) => void;
  placeholder?: string;
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
