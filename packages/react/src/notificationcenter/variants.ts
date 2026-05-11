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
  onItemClick?: (id: string, item: NotificationItem) => void;
  onItemAction?: (id: string, item: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onClose?: () => void;
  className?: string;
}
