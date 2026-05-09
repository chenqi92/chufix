export type StatusBarTone =
  | 'default'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type StatusBarSize = 'sm' | 'md';

export interface StatusBarItem {
  id: string;
  label: string;
  tone?: StatusBarTone;
  /** Optional icon as Vue node — passed through default slot via <template #icon-{id}>. */
  iconKey?: string;
  shortcut?: string;
  disabled?: boolean;
}

export interface StatusBarProps {
  size?: StatusBarSize;
  /** Background tone of the entire bar (e.g. 'error' to flag fatal state). */
  tone?: StatusBarTone;
  leftItems?: StatusBarItem[];
  centerItems?: StatusBarItem[];
  rightItems?: StatusBarItem[];
}
