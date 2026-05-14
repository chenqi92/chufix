export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolCallCardProps {
  /** Tool name, e.g. 'web_search' / 'bash' / 'edit_file'. */
  name: string;
  /** Tool input arguments (will be JSON-stringified for display). */
  input?: unknown;
  /** Tool output (if any). */
  output?: unknown;
  status?: ToolCallStatus;
  /** Duration in ms. */
  duration?: number;
  /** Allow expanding / collapsing the body. Default true. */
  collapsible?: boolean;
  /** Default expanded state. Default false. */
  defaultOpen?: boolean;
  /** Optional explicit error message (overrides output for the error branch). */
  errorMessage?: string;
}

export function formatDuration(ms: number | undefined): string {
  if (!ms || ms <= 0) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function safeStringify(value: unknown): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export const STATUS_LABEL: Record<ToolCallStatus, string> = {
  pending: '等待',
  running: '执行中',
  success: '成功',
  error: '失败',
};
