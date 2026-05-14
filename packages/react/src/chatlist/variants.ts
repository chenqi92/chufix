import type { ReactNode } from 'react';

export type ChatGroupBy = 'role' | 'date' | 'none';

export interface ChatListProps {
  autoScroll?: boolean;
  stickToBottom?: boolean;
  stickThreshold?: number;
  groupBy?: ChatGroupBy;
  showDateSeparators?: boolean;
  children?: ReactNode;
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
