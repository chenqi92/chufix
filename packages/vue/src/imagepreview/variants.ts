export interface ImagePreviewProps {
  src?: string;
  alt?: string;
  open?: boolean;
  modelValue?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function imagePreviewClass(p: { className?: string }): string {
  return ['cf-imgpreview', p.className].filter(Boolean).join(' ');
}

export function clampZoom(z: number): number {
  return Math.max(0.25, Math.min(8, z));
}
