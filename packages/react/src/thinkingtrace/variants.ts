import type { ReactNode } from 'react';

export type ThinkingStatus = 'thinking' | 'done';

export interface ThinkingTraceProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  status?: ThinkingStatus;
  label?: string;
  children?: ReactNode;
}

export function formatDuration(ms: number | undefined): string {
  if (!ms || ms <= 0) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
