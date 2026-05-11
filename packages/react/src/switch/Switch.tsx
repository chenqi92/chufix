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
    onCheckedChange,
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
    onCheckedChange?.(e.target.checked, {
      event: e,
      checked: e.target.checked,
      name: e.target.name || undefined,
    });
    onChange?.(e);
  }

  return (
    <label className={switchClass({ size, disabled, loading, className })}>
      <input
        ref={ref}
        type="checkbox"
        className="cf-switch__input"
        checked={current}
        disabled={isInactive}
        role="switch"
        aria-checked={current}
        onChange={handleChange}
        {...rest}
      />
      <span className="cf-switch__track">
        <span className="cf-switch__thumb" />
      </span>
      {children ? <span>{children}</span> : null}
    </label>
  );
});
