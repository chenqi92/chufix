export type EmptySize = 'sm' | 'md' | 'lg';

export interface EmptyProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: EmptySize;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export function emptyClass(p: { size: EmptySize }): string {
  return ['cf-empty', `cf-empty--${p.size}`].join(' ');
}
