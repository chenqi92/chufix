export type ProtocolKind =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'del'
  | 'delete'
  | 'head'
  | 'options'
  | 'opt'
  | 'ws'
  | 'mqtt'
  | 'grpc'
  | 'sse'
  | 'gql'
  | 'graphql';

export type ProtocolBadgeSize = 'sm' | 'md' | 'lg';

export interface ProtocolBadgeProps {
  /** Either an HTTP method or a transport protocol (case-insensitive). */
  kind: ProtocolKind | string;
  size?: ProtocolBadgeSize;
}

const KIND_ALIASES: Record<string, ProtocolKind> = {
  delete: 'del',
  options: 'opt',
  graphql: 'gql',
};

const KNOWN: ProtocolKind[] = [
  'get',
  'post',
  'put',
  'patch',
  'del',
  'head',
  'opt',
  'ws',
  'mqtt',
  'grpc',
  'sse',
  'gql',
];

export function normalizeKind(kind: string): ProtocolKind | null {
  const k = kind.trim().toLowerCase();
  const mapped = (KIND_ALIASES[k] as ProtocolKind | undefined) ?? (k as ProtocolKind);
  return KNOWN.includes(mapped) ? mapped : null;
}

const LABEL_OVERRIDE: Partial<Record<ProtocolKind, string>> = {
  del: 'DEL',
  opt: 'OPTS',
  grpc: 'gRPC',
};

export function displayLabel(kind: string): string {
  const norm = normalizeKind(kind);
  if (!norm) return kind.toUpperCase();
  return LABEL_OVERRIDE[norm] ?? norm.toUpperCase();
}

export function protocolBadgeClass(p: ProtocolBadgeProps): string {
  const norm = normalizeKind(p.kind);
  return [
    'cf-proto',
    `cf-proto--${p.size ?? 'md'}`,
    norm && `cf-proto--${norm}`,
    !norm && 'cf-proto--unknown',
  ]
    .filter(Boolean)
    .join(' ');
}
