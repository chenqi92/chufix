export type ChatGroupBy = 'role' | 'date' | 'none';

export interface ChatListProps {
  /** Auto-scroll to bottom when content grows. Default true. */
  autoScroll?: boolean;
  /**
   * Only auto-scroll when the user is already at/near the bottom. Default true.
   * Set false to always force scroll-to-bottom.
   */
  stickToBottom?: boolean;
  /** Pixels from the bottom considered "at bottom" for stickToBottom logic. Default 64. */
  stickThreshold?: number;
  /** Visual grouping. Currently only used for spacing / future date separators. */
  groupBy?: ChatGroupBy;
  /** Show a date label between days when groupBy='date'. Default true. */
  showDateSeparators?: boolean;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDayLabel(d: Date): string {
  const now = new Date();
  if (isSameDay(now, d)) return '今天';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(yesterday, d)) return '昨天';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
