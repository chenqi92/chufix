export type NotificationTone =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  tone?: NotificationTone;
  /** ISO timestamp or pre-formatted relative string. */
  timestamp?: string;
  read?: boolean;
  actionLabel?: string;
}

export interface NotificationCenterProps {
  items: NotificationItem[];
  open?: boolean;
  emptyText?: string;
  showMarkAllRead?: boolean;
  showClearAll?: boolean;
  maxHeight?: number | string;
}
