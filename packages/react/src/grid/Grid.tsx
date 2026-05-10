import { forwardRef } from 'react';
import { gridClass, gridStyle, type GridProps } from './variants';

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  const {
    as: Comp = 'div',
    columns,
    minItemWidth,
    gap = 'md',
    align = 'stretch',
    justify = 'stretch',
    dense = false,
    className,
    style,
    ...rest
  } = props;
  const Component = Comp as any;

  return (
    <Component
      ref={ref}
      className={gridClass({ align, justify, dense, className })}
      style={gridStyle({ columns, minItemWidth, gap, style })}
      {...rest}
    />
  );
});
