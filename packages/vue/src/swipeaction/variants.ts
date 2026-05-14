export type SwipeActionTone =
  | 'default'
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

export interface SwipeActionItem {
  /** Stable id; emitted with `action` event. */
  key: string;
  label: string;
  tone?: SwipeActionTone;
  /** Optional click handler; also receives the key via the parent `action` event. */
  onClick?: () => void;
}

export interface SwipeActionProps {
  /** Items revealed by swiping the row to the right (rail anchored on the left). */
  left?: SwipeActionItem[];
  /** Items revealed by swiping the row to the left (rail anchored on the right). */
  right?: SwipeActionItem[];
  /** Min horizontal displacement to consider opening (px). Default 24. */
  threshold?: number;
  /** Close the rail when user taps outside. Default true. */
  closeOnOutsideTap?: boolean;
  /** Disable the gesture entirely. */
  disabled?: boolean;
}
