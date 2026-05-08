export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps {
  value?: number;
  defaultValue?: number;
  total?: number;
  pageSize?: number;
  siblingCount?: number;
  size?: PaginationSize;
  showNav?: boolean;
  showJumper?: boolean;
  showTotal?: boolean;
  onChange?: (page: number) => void;
}

export function buildPages(
  current: number,
  totalPages: number,
  siblings = 1,
): Array<number | '…'> {
  if (totalPages <= 1) return [1];
  const first = 1;
  const last = totalPages;
  const left = Math.max(current - siblings, first + 1);
  const right = Math.min(current + siblings, last - 1);

  const out: Array<number | '…'> = [first];
  if (left > first + 1) out.push('…');
  for (let i = left; i <= right; i++) out.push(i);
  if (right < last - 1) out.push('…');
  if (last !== first) out.push(last);
  return out;
}

export function paginationClass(p: { size: PaginationSize }): string {
  return ['cf-pagination', `cf-pagination--${p.size}`].join(' ');
}
