import { forwardRef } from 'react';
import { rowClass, rowStyle, type RowProps } from './variants';

export const Row = forwardRef<HTMLElement, RowProps>(function Row(props, ref) {
  const {
    as: Comp = 'div',
    gutter = 0,
    justify = 'start',
    align = 'top',
    wrap = true,
    className,
    style,
    ...rest
  } = props;
  const Component = Comp as any;

  return (
    <Component
      ref={ref}
      className={rowClass({ justify, align, wrap, className })}
      style={rowStyle(gutter, style)}
      {...rest}
    />
  );
});
