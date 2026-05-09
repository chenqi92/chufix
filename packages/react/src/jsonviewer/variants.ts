export type JsonViewerSize = 'sm' | 'md' | 'lg';

export interface JsonViewerProps {
  data: unknown;
  defaultExpandDepth?: number;
  size?: JsonViewerSize;
  bordered?: boolean;
  lineNumbers?: boolean;
  showTypes?: boolean;
  className?: string;
}

export type JsonValueType =
  | 'null'
  | 'undefined'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object';

export function typeOf(value: unknown): JsonValueType {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value as JsonValueType;
}

export function jsonViewerClass(p: {
  size: JsonViewerSize;
  bordered: boolean;
  lineNumbers: boolean;
  className?: string;
}): string {
  return [
    'cf-json',
    `cf-json--${p.size}`,
    p.bordered && 'is-bordered',
    p.lineNumbers && 'has-numbers',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
