export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolCallCardProps {
  name: string;
  input?: unknown;
  output?: unknown;
  status?: ToolCallStatus;
  duration?: number;
  collapsible?: boolean;
  defaultOpen?: boolean;
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
