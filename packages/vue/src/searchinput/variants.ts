export type SearchInputSize = 'sm' | 'md' | 'lg';

export interface SearchInputProps {
  modelValue?: string;
  placeholder?: string;
  size?: SearchInputSize;
  disabled?: boolean;
  /** Show keyboard shortcut hint on the right (e.g. "Ctrl K"). */
  shortcut?: string;
  /** Show clear button when value is non-empty (default true). */
  clearable?: boolean;
}

export function searchInputClass(p: { size: SearchInputSize }): string {
  return ['cf-search', `cf-search--${p.size}`].join(' ');
}
