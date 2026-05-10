import { forwardRef, useContext, useState, type ChangeEvent } from 'react';
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
    onFocus,
    onBlur,
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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (finalDisabled) return;
    const meta = {
      event: e,
      value,
      name: finalName,
      checked: e.target.checked,
    };
    if (group) {
      group.select(value, meta);
    } else {
      if (!isControlled) setInternal(true);
      onChange?.(value, meta);
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
        className="cf-radio__input"
        checked={current}
        disabled={finalDisabled}
        name={finalName}
        id={id}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <span className="cf-radio__dot" aria-hidden="true" />
      {children ? <span className="cf-radio__label">{children}</span> : null}
    </label>
  );
});
