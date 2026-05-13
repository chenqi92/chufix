export type EditableSize = 'sm' | 'md' | 'lg';

export interface EditableProps {
  modelValue: string;
  /** Placeholder shown when value is empty. */
  placeholder?: string;
  /** Render as multi-line textarea instead of single-line input. */
  multiline?: boolean;
  /** Disable editing entirely. Shows read-only text. */
  disabled?: boolean;
  /** Show pencil icon hint on hover. Default true. */
  showHint?: boolean;
  /** Whether Enter (single-line) / Cmd+Enter (multi-line) commits. */
  commitOnEnter?: boolean;
  /** Maximum input length. */
  maxLength?: number;
  size?: EditableSize;
  ariaLabel?: string;
  /** Async validation: return false (or a string error message) to reject the commit. */
  validate?: (next: string) => boolean | string | Promise<boolean | string>;
}

export interface EditableCommitPayload {
  value: string;
  previous: string;
}
