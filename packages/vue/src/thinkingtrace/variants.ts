export type ThinkingStatus = 'thinking' | 'done';

export interface ThinkingTraceProps {
  /** Controlled expanded state. */
  open?: boolean;
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Duration in ms; rendered as "Thought for 12.4s" in the header. */
  duration?: number;
  status?: ThinkingStatus;
  /** Header label override. */
  label?: string;
}

export function formatDuration(ms: number | undefined): string {
  if (!ms || ms <= 0) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
