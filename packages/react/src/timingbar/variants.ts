export interface TimingPhase {
  label: string;
  start: number;
  end: number;
  colorIndex?: number;
}

export interface TimingBarProps {
  phases: TimingPhase[];
  width?: number;
  height?: number;
  totalLabel?: string;
  showAxis?: boolean;
  /** Segment label rendering strategy. `auto` hides labels that would collide. */
  labelMode?: 'auto' | 'all' | 'none';
  ariaLabel?: string;
  className?: string;
}
