import { forwardRef } from 'react';
import { colClass, colStyle, type ColProps } from './variants';

export const Col = forwardRef<HTMLElement, ColProps>(function Col(props, ref) {
  const {
    as: Comp = 'div',
    span,
    offset,
    push,
    pull,
    order,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    className,
    style,
    ...rest
  } = props;
  const Component = Comp as any;

  return (
    <Component
      ref={ref}
      className={colClass({ xs, sm, md, lg, xl, xxl, className })}
      style={colStyle({ span, offset, push, pull, order, xs, sm, md, lg, xl, xxl, style })}
      {...rest}
    />
  );
});
