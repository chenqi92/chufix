import { forwardRef, useContext, useState } from 'react';
import { RadioGroupContext } from './RadioGroup';
import { radioClass, type RadioProps } from './variants';

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  props,
  ref,
) {
  const {
    value,
    checked,
    defaultChecked,
    size = 'md',
    disabled = false,
    name,
    id,
    onChange,
    children,
    className,
  } = props;

  const group = useContext(RadioGroupContext);

  const isControlled = checked !== undefined || group !== null;
  const [internal, setInternal] = useState<boolean>(!!defaultChecked);

  const groupChecked = group ? group.value === value : false;
  const current =
    group !== null
      ? groupChecked
      : isControlled
        ? !!checked
        : internal;

  const finalSize = group?.size ?? size;
  const finalDisabled = (group?.disabled ?? false) || disabled;
  const finalName = group?.name ?? name;

  function handleChange() {
    if (finalDisabled) return;
    if (group) {
      group.select(value);
    } else {
      if (!isControlled) setInternal(true);
      onChange?.(value);
    }
  }

  return (
    <label
      className={radioClass({
        size: finalSize,
        disabled: finalDisabled,
        checked: current,
        className,
      })}
    >
      <input
        ref={ref}
        type="radio"
        className="ck-radio__input"
        checked={current}
        disabled={finalDisabled}
        name={finalName}
        id={id}
        onChange={handleChange}
      />
      <span className="ck-radio__dot" aria-hidden="true" />
      {children ? <span className="ck-radio__label">{children}</span> : null}
    </label>
  );
});
