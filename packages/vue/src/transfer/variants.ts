export interface TransferItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TransferProps {
  dataSource: TransferItem[];
  modelValue?: string[];
  defaultValue?: string[];
  titles?: [string, string];
  searchable?: boolean;
  className?: string;
}

export function transferClass(p: { className?: string }): string {
  return ['cf-transfer', p.className].filter(Boolean).join(' ');
}
