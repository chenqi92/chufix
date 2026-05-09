import { Tabs } from '../tabs/Tabs';
import type { SegmentedProps } from './variants';

export function SegmentedControl(props: SegmentedProps) {
  const {
    value,
    defaultValue,
    items,
    size = 'md',
    align = 'start',
    onChange,
  } = props;

  return (
    <Tabs
      variant="segmented"
      size={size}
      align={align}
      items={items}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}
