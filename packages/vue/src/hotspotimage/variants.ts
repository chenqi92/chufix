export type HotspotTone = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface HotspotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HotspotCircle {
  cx: number;
  cy: number;
  r: number;
}

export interface HotspotItem {
  id: string;
  shape: 'rect' | 'circle';
  rect?: HotspotRect;
  circle?: HotspotCircle;
  label?: string;
  tone?: HotspotTone;
  data?: unknown;
}

export function toneStroke(tone: HotspotTone = 'info'): string {
  switch (tone) {
    case 'success': return 'var(--status-success)';
    case 'warning': return 'var(--status-warning)';
    case 'error': return 'var(--status-error)';
    case 'info': return 'var(--status-info)';
    case 'default':
    default: return 'var(--accent-1)';
  }
}

export function toneFill(tone: HotspotTone = 'info'): string {
  switch (tone) {
    case 'success': return 'var(--status-success-soft)';
    case 'warning': return 'var(--status-warning-soft)';
    case 'error': return 'var(--status-error-soft)';
    case 'info': return 'var(--status-info-soft)';
    case 'default':
    default: return 'var(--accent-soft)';
  }
}
