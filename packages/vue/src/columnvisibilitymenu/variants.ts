export type ColumnPin = 'left' | 'right' | null;

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  pinned?: ColumnPin;
  /** When true, cannot be hidden / unpinned via UI. */
  locked?: boolean;
}

export interface ColumnVisibilityMenuProps {
  /** Current ordered column config. */
  modelValue: ColumnConfig[];
  /** Show pin left/right controls. Default true. */
  showPinning?: boolean;
  /** Allow drag-reorder. Default true. */
  showReorder?: boolean;
  /** Trigger button label. */
  triggerLabel?: string;
  /** Menu label / aria. */
  menuLabel?: string;
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr.slice();
  const next = arr.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
