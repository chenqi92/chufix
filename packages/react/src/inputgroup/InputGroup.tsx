import { inputGroupClass, type InputGroupProps } from './variants';

export function InputGroup(props: InputGroupProps) {
  const {
    orientation = 'horizontal',
    size = 'md',
    stretch = false,
    className,
    children,
  } = props;
  const cls = inputGroupClass({ orientation, size, stretch });
  return (
    <div className={className ? `${cls} ${className}` : cls} role="group">
      {children}
    </div>
  );
}
