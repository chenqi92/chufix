import type { ReactNode } from 'react';

export interface TearOffTabItem {
  id: string;
  title: string;
  contentKey?: string;
  modified?: boolean;
  closable?: boolean;
}

export interface TearOffTabsProps {
  tabs: TearOffTabItem[];
  value?: string;
  onChange?: (value: string) => void;
  tearThreshold?: number;
  onTearOff?: (
    id: string,
    item: TearOffTabItem,
    x: number,
    y: number,
  ) => void;
  onClose?: (id: string, item: TearOffTabItem) => void;
  /** Map of "content-{key}" to ReactNode. */
  slots?: Record<string, ReactNode>;
  className?: string;
}
