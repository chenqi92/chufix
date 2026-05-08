import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
} from 'react';
import { textareaClass, type TextareaProps } from './variants';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      rows = 3,
      disabled = false,
      error = false,
      resize = 'vertical',
      autoResize = false,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      className,
      style,
      ...rest
    } = props;

    const taRef = useRef<HTMLTextAreaElement | null>(null);
    useImperativeHandle(ref, () => taRef.current as HTMLTextAreaElement);

    const [focused, setFocused] = useState(false);
    const [internal, setInternal] = useState<string>(
      typeof defaultValue === 'string' ? defaultValue : '',
    );
    const isControlled = value !== undefined;
    const current = isControlled ? String(value) : internal;

    function autoSize() {
      const el = taRef.current;
      if (!el || !autoResize) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }

    useEffect(() => {
      if (autoResize) autoSize();
    });

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    }

    function handleFocus(e: FocusEvent<HTMLTextAreaElement>) {
      setFocused(true);
      onFocus?.(e);
    }

    function handleBlur(e: FocusEvent<HTMLTextAreaElement>) {
      setFocused(false);
      onBlur?.(e);
    }

    const taStyle: CSSProperties = {
      ...style,
      resize: autoResize ? 'none' : resize,
    };

    const overLimit = maxLength != null && current.length > maxLength;

    return (
      <div
        className={textareaClass({
          variant,
          size,
          focused,
          disabled,
          error,
          className,
        })}
      >
        <textarea
          ref={taRef}
          className="cf-textarea__el"
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          value={current}
          style={taStyle}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {showCount ? (
          <div
            className={
              'cf-textarea__count' + (overLimit ? ' is-over' : '')
            }
          >
            {current.length}
            {maxLength != null ? ` / ${maxLength}` : null}
          </div>
        ) : null}
      </div>
    );
  },
);
