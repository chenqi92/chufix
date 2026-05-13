export interface TimingPhase {
  label: string;
  start: number;
  end: number;
  colorIndex?: number;
}

export interface TimingBarInteractionPayload {
  phase: TimingPhase;
  dataIndex: number;
  duration: number;
  nativeEvent?: unknown;
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
  onItemEnter?: (payload: TimingBarInteractionPayload) => void;
  onItemLeave?: (payload: TimingBarInteractionPayload) => void;
}
