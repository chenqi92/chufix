import { forwardRef, type HTMLAttributes } from 'react';
import { toolbarClass, toolbarDefaults, type ToolbarProps } from './variants';

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  props,
  ref,
) {
  const {
    variant = toolbarDefaults.variant,
    size = toolbarDefaults.size,
    orientation = toolbarDefaults.orientation,
    className,
    children,
    ...rest
  } = props;

  const cls = toolbarClass({ variant, size, orientation, className });

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation={orientation}
      className={cls}
      {...rest}
    >
      {children}
    </div>
  );
});

export const ToolbarSeparator = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function ToolbarSeparator(props, ref) {
  const { className, ...rest } = props;
  return (
    <span
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      className={['cf-toolbar__sep', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});
