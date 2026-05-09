export interface TimingPhase {
  label: string;
  start: number;
  end: number;
  /** Color tone or category index. */
  colorIndex?: number;
}

export interface TimingBarProps {
  phases: TimingPhase[];
  width?: number;
  height?: number;
  totalLabel?: string;
  showAxis?: boolean;
  ariaLabel?: string;
}
