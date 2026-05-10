import { forwardRef } from 'react';
import { flexClass, flexStyle, type FlexProps } from './variants';

export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(props, ref) {
  const {
    as: Comp = 'div',
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    gap = 'md',
    wrap = false,
    inline = false,
    full = false,
    className,
    style,
    ...rest
  } = props;
  const Component = Comp as any;

  return (
    <Component
      ref={ref}
      className={flexClass({ direction, align, justify, wrap, inline, full, className })}
      style={flexStyle(gap, style)}
      {...rest}
    />
  );
});
