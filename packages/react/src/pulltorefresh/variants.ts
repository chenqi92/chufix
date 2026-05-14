import type { ReactNode } from 'react';

export interface PullToRefreshProps {
  threshold?: number;
  maxDistance?: number;
  refreshing?: boolean;
  disabled?: boolean;
  onRefresh?: () => unknown | Promise<unknown>;
  /** Custom label rendered while user is pulling but threshold not reached. */
  pullingLabel?: ReactNode;
  /** Custom label rendered once threshold is reached (release to refresh). */
  readyLabel?: ReactNode;
  /** Custom label rendered while refresh is in progress. */
  refreshingLabel?: ReactNode;
  children?: ReactNode;
}

export type PullStage = 'idle' | 'pulling' | 'ready' | 'refreshing';
