export interface TearOffTabItem {
  id: string;
  title: string;
  /** Slot key — content rendered via <template #content-{key}>. */
  contentKey?: string;
  modified?: boolean;
  closable?: boolean;
}

export interface TearOffTabsProps {
  tabs: TearOffTabItem[];
  modelValue?: string;
  /** Drag distance in px before tab is considered "torn off". Default 60. */
  tearThreshold?: number;
}
