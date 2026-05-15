export type PhaseType = 'queued' | 'blocked' | 'dns' | 'connect' | 'ssl' | 'wait' | 'receive';

export interface TimingPhase {
  type: PhaseType;
  duration: number;
}

export interface RequestTiming {
  id: string;
  label: string;
  start: number;
  end: number;
  phases?: TimingPhase[];
  status?: number;
  tone?: 'default' | 'success' | 'warning' | 'error';
}

export const PHASE_COLOR: Record<PhaseType, string> = {
  queued: 'oklch(60% 0.06 260)',
  blocked: 'oklch(70% 0.13 78)',
  dns: 'oklch(68% 0.11 195)',
  connect: 'oklch(68% 0.13 263)',
  ssl: 'oklch(68% 0.16 320)',
  wait: 'oklch(72% 0.14 110)',
  receive: 'oklch(70% 0.15 152)',
};

export function totalRange(requests: RequestTiming[]): { min: number; max: number } {
  if (requests.length === 0) return { min: 0, max: 1 };
  let min = Infinity;
  let max = -Infinity;
  for (const r of requests) {
    if (r.start < min) min = r.start;
    if (r.end > max) max = r.end;
  }
  return { min, max };
}

export function formatTime(ms: number, unit: 'ms' | 's' = 'ms'): string {
  if (unit === 's') return `${(ms / 1000).toFixed(2)}s`;
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export function pickGridStep(range: number): number {
  if (range <= 50) return 10;
  if (range <= 200) return 25;
  if (range <= 500) return 50;
  if (range <= 1000) return 100;
  if (range <= 5000) return 500;
  if (range <= 10000) return 1000;
  return Math.pow(10, Math.floor(Math.log10(range)));
}
