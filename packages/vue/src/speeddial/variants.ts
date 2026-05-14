export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
export type SpeedDialTrigger = 'click' | 'hover';
export type SpeedDialLabelMode = 'hover' | 'always' | 'never';

export interface SpeedDialAction {
  key: string;
  /** SVG path data string. */
  iconPath?: string;
  label?: string;
  disabled?: boolean;
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  direction?: SpeedDialDirection;
  position?: SpeedDialPosition;
  trigger?: SpeedDialTrigger;
  showLabels?: SpeedDialLabelMode;
  /** Controlled open state. */
  open?: boolean;
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Main button aria-label. */
  ariaLabel?: string;
}
