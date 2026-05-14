export interface PullToRefreshProps {
  /** Distance (px) the user must pull down before release triggers refresh. Default 64. */
  threshold?: number;
  /** Max distance the indicator can be dragged. Default 96. */
  maxDistance?: number;
  /** Controlled refreshing state. When true, indicator stays visible spinning. */
  refreshing?: boolean;
  /** Disable the pull gesture entirely. */
  disabled?: boolean;
}

export type PullStage = 'idle' | 'pulling' | 'ready' | 'refreshing';
