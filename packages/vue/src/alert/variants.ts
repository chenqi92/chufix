export type AlertTone = 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'soft' | 'outline' | 'solid';

export interface AlertProps {
  tone?: AlertTone;
  variant?: AlertVariant;
  title?: string;
  closable?: boolean;
  icon?: boolean;
}

export function alertClass(p: { tone: AlertTone; variant: AlertVariant }): string {
  return ['ck-alert', `ck-alert--${p.tone}`, `ck-alert--${p.variant}`].join(' ');
}
