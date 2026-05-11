import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { checkboxClass, type CheckboxProps } from './variants';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      size = 'md',
      indeterminate = false,
      disabled = false,
      checked,
      defaultChecked,
      onChange,
      onCheckedChange,
      className,
      children,
      ...rest
    } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isControlled = checked !== undefined;
    const [internal, setInternal] = useState<boolean>(!!defaultChecked);
    const current = isControlled ? !!checked : internal;

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      if (disabled) return;
      if (!isControlled) setInternal(e.target.checked);
      onCheckedChange?.(e.target.checked, {
        event: e,
        checked: e.target.checked,
        indeterminate,
        value: e.target.value,
        name: e.target.name || undefined,
      });
      onChange?.(e);
    }

    return (
      <label
        className={checkboxClass({ size, disabled, indeterminate, className })}
      >
        <input
          ref={inputRef}
          type="checkbox"
          className="cf-checkbox__input"
          checked={current}
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : current}
          onChange={handleChange}
          {...rest}
        />
        <span className="cf-checkbox__box" aria-hidden="true">
          {indeterminate ? (
            <span className="cf-checkbox__dash" />
          ) : (
            <svg className="cf-checkbox__check" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8.5l3.2 3.2L13 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {children ? <span className="cf-checkbox__label">{children}</span> : null}
      </label>
    );
  },
);
