export interface TransferItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TransferProps {
  dataSource: TransferItem[];
  value?: string[];
  defaultValue?: string[];
  titles?: [string, string];
  searchable?: boolean;
  className?: string;
  onChange?: (keys: string[]) => void;
}

export function transferClass(p: { className?: string }): string {
  return ['cf-transfer', p.className].filter(Boolean).join(' ');
}
