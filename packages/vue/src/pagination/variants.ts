export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps {
  /** 当前页（1-based），受控 */
  modelValue?: number;
  /** 总条目数 */
  total?: number;
  /** 每页条目数 */
  pageSize?: number;
  /** 当 page 总数较多时，中间显示几个相邻页码（默认 1，即 ... 5 6 7 ...） */
  siblingCount?: number;
  size?: PaginationSize;
  /** 显示「上一页 / 下一页」按钮 */
  showNav?: boolean;
  /** 显示「跳转到」输入框 */
  showJumper?: boolean;
  /** 显示总数文案 */
  showTotal?: boolean;
}

/** 输出页码列表，'…' 代表省略号。 */
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
