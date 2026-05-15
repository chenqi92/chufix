export type AnnotationTone = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ImageAnnotation {
  id: string;
  x: number;
  y: number;
  label?: string;
  tone?: AnnotationTone;
  data?: unknown;
}

export function clampNorm(v: number): number {
  return Math.max(0, Math.min(1, v));
}
