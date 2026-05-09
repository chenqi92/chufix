export type DropzoneSize = 'sm' | 'md' | 'lg';

export type DropzoneRejectReason =
  | 'too-many'
  | 'too-large'
  | 'wrong-type'
  | 'duplicate';

export interface DropzoneRejection {
  file: File;
  reason: DropzoneRejectReason;
}

export interface DropzoneFileStatus {
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface DropzoneProps {
  value?: File[];
  defaultValue?: File[];
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  size?: DropzoneSize;
  hint?: string;
  statuses?: DropzoneFileStatus[];
  hideList?: boolean;
  className?: string;
  children?: import('react').ReactNode;
  icon?: import('react').ReactNode;
  onChange?: (files: File[]) => void;
  onReject?: (rejections: DropzoneRejection[]) => void;
  onRemove?: (file: File, index: number) => void;
}

export function dropzoneClass(p: {
  size: DropzoneSize;
  disabled: boolean;
  active: boolean;
  reject: boolean;
  className?: string;
}): string {
  return [
    'cf-dropzone',
    `cf-dropzone--${p.size}`,
    p.disabled && 'is-disabled',
    p.active && 'is-active',
    p.reject && 'is-reject',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const patterns = accept.split(',').map((s) => s.trim()).filter(Boolean);
  if (!patterns.length) return true;
  return patterns.some((p) => {
    if (p.startsWith('.')) {
      return file.name.toLowerCase().endsWith(p.toLowerCase());
    }
    if (p.endsWith('/*')) {
      const head = p.slice(0, -2);
      return file.type.startsWith(head + '/');
    }
    return file.type === p;
  });
}
