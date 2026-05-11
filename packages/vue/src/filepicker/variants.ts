export type FilePickerSize = 'sm' | 'md' | 'lg';
export type FilePickerVariant = 'outline' | 'plain';

export interface FilePickerProps {
  modelValue?: File[] | null;
  multiple?: boolean;
  accept?: string;
  size?: FilePickerSize;
  variant?: FilePickerVariant;
  disabled?: boolean;
  buttonText?: string;
  emptyText?: string;
  /** Show selected files inline next to the trigger. Default true. */
  showFiles?: boolean;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
