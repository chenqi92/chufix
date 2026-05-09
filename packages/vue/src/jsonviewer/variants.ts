export type JsonViewerSize = 'sm' | 'md' | 'lg';

export interface JsonViewerProps {
  data: unknown;
  /** Auto-expand levels deep. Pass Infinity for fully expanded. */
  defaultExpandDepth?: number;
  size?: JsonViewerSize;
  bordered?: boolean;
  /** Show line numbers in the gutter. */
  lineNumbers?: boolean;
  /** Show data types next to keys. */
  showTypes?: boolean;
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
}): string {
  return [
    'cf-json',
    `cf-json--${p.size}`,
    p.bordered && 'is-bordered',
    p.lineNumbers && 'has-numbers',
  ]
    .filter(Boolean)
    .join(' ');
}
