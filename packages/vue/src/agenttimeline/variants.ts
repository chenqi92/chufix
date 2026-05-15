export type AgentEventType =
  | 'thought'
  | 'tool'
  | 'action'
  | 'observation'
  | 'message'
  | 'error';

export interface AgentEvent {
  id: string;
  type: AgentEventType;
  title?: string;
  content?: string;
  timestamp?: number | string;
  duration?: number;
  meta?: Record<string, string | number>;
}

export function formatStamp(t: number | string | undefined): string {
  if (t === undefined) return '';
  if (typeof t === 'string') return t;
  const d = new Date(t);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

export function formatMs(ms: number | undefined): string {
  if (ms === undefined || ms < 0) return '';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}
