import type { TabsItem, TabsSize, TabsAlign } from '../tabs/variants';

export type SegmentedSize = TabsSize;
export type SegmentedAlign = TabsAlign;
export type SegmentedItem = TabsItem;

export interface SegmentedProps {
  value?: string;
  defaultValue?: string;
  items?: SegmentedItem[];
  size?: SegmentedSize;
  align?: SegmentedAlign;
  onChange?: (value: string) => void;
}
