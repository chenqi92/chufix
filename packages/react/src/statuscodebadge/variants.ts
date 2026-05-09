export type StatusCodeBadgeSize = 'sm' | 'md' | 'lg';

export interface StatusCodeBadgeProps {
  code: number;
  reason?: string;
  size?: StatusCodeBadgeSize;
  className?: string;
}

export type StatusClass = 's1' | 's2' | 's3' | 's4' | 's5' | 'unknown';

export function classifyStatus(code: number): StatusClass {
  if (code >= 100 && code < 200) return 's1';
  if (code >= 200 && code < 300) return 's2';
  if (code >= 300 && code < 400) return 's3';
  if (code >= 400 && code < 500) return 's4';
  if (code >= 500 && code < 600) return 's5';
  return 'unknown';
}

export function statusCodeBadgeClass(p: StatusCodeBadgeProps): string {
  return [
    'cf-statuscode',
    `cf-statuscode--${p.size ?? 'md'}`,
    `cf-statuscode--${classifyStatus(p.code)}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
