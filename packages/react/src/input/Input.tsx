import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type FocusEvent,
} from 'react';
import { inputClass, type InputProps } from './variants';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref,
) {
  const {
    variant = 'outline',
    inputSize = 'md',
    error = false,
    clearable = false,
    prefix,
    suffix,
    disabled = false,
    readOnly = false,
    className,
    value,
    defaultValue,
    onClear,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const innerRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  const [focused, setFocused] = useState(false);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(
    defaultValue != null ? String(defaultValue) : '',
  );
  const current = isControlled ? String(value ?? '') : internal;

  const cls = inputClass({
    variant,
    size: inputSize,
    focused,
    disabled,
    error,
    className,
  });

  const showClear = clearable && !disabled && !readOnly && current.length > 0;

  function handleClear() {
    if (!isControlled) setInternal('');
    onClear?.();
    const node = innerRef.current;
    if (node) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(node, '');
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.focus();
    }
  }

  return (
    <label
      className={cls}
      onMouseDown={(e) => {
        if (e.target !== innerRef.current) {
          // keep focus inside input when clicking on wrapper/affixes
          e.preventDefault();
          innerRef.current?.focus();
        }
      }}
    >
      {prefix ? <span className="cf-input__prefix">{prefix}</span> : null}
      <input
        ref={innerRef}
        className="cf-input__native"
        value={current}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => {
          if (!isControlled) setInternal(e.target.value);
          onChange?.(e);
        }}
        onFocus={(e: FocusEvent<HTMLInputElement>) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {showClear ? (
        <button
          type="button"
          className="cf-input__clear"
          tabIndex={-1}
          aria-label="清空"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : suffix ? (
        <span className="cf-input__suffix">{suffix}</span>
      ) : null}
    </label>
  );
});
