import { buttonGroupClass, type ButtonGroupProps } from './variants';

export function ButtonGroup(props: ButtonGroupProps) {
  const { ariaLabel, orientation = 'horizontal', style, children } = props;
  return (
    <div
      className={buttonGroupClass(props)}
      role="group"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      style={style}
    >
      {children}
    </div>
  );
}
