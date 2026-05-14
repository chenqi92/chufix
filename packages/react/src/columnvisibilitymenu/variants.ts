export type ColumnPin = 'left' | 'right' | null;

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  pinned?: ColumnPin;
  locked?: boolean;
}

export interface ColumnVisibilityMenuProps {
  value: ColumnConfig[];
  onChange: (cols: ColumnConfig[]) => void;
  showPinning?: boolean;
  showReorder?: boolean;
  triggerLabel?: string;
  menuLabel?: string;
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr.slice();
  const next = arr.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
