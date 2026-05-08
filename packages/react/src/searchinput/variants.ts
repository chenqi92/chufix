export type SearchInputSize = 'sm' | 'md' | 'lg';

export interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: SearchInputSize;
  disabled?: boolean;
  shortcut?: string;
  clearable?: boolean;
  onChange?: (v: string) => void;
  onSearch?: (v: string) => void;
  onClear?: () => void;
}

export function searchInputClass(p: { size: SearchInputSize }): string {
  return ['cf-search', `cf-search--${p.size}`].join(' ');
}
