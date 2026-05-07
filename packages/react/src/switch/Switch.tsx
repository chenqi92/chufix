import { forwardRef, useState, type ChangeEvent } from 'react';
import { switchClass, type SwitchProps } from './variants';

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  props,
  ref,
) {
  const {
    size = 'md',
    loading = false,
    disabled = false,
    checked,
    defaultChecked,
    onChange,
    className,
    children,
    ...rest
  } = props;

  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState<boolean>(!!defaultChecked);
  const current = isControlled ? !!checked : internal;
  const isInactive = disabled || loading;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (isInactive) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  }

  return (
    <label className={switchClass({ size, disabled, loading, className })}>
      <input
        ref={ref}
        type="checkbox"
        className="ck-switch__input"
        checked={current}
        disabled={isInactive}
        role="switch"
        aria-checked={current}
        onChange={handleChange}
        {...rest}
      />
      <span className="ck-switch__track">
        <span className="ck-switch__thumb" />
      </span>
      {children ? <span>{children}</span> : null}
    </label>
  );
});
