export type EditableSize = 'sm' | 'md' | 'lg';

export interface EditableCommitPayload {
  value: string;
  previous: string;
}

export interface EditableProps {
  value: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  showHint?: boolean;
  commitOnEnter?: boolean;
  maxLength?: number;
  size?: EditableSize;
  ariaLabel?: string;
  className?: string;
  validate?: (next: string) => boolean | string | Promise<boolean | string>;
  onChange?: (value: string) => void;
  onCommit?: (payload: EditableCommitPayload) => void;
  onCancel?: () => void;
  onEditStart?: () => void;
  onInvalid?: (message: string) => void;
}
