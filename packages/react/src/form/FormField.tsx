import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
} from 'react';
import { FormContext, type FormFieldProps } from './variants';

export function FormField(props: FormFieldProps) {
  const { name, label, required, hint, error, htmlFor, layout, className, children } = props;
  const ctx = useContext(FormContext);
  const reactId = useId();
  const id = htmlFor ?? `cf-field-${reactId}`;
  const fieldLayout = layout ?? ctx.layout;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const ruleRequired =
    required ??
    (name && ctx.rules?.[name]?.some((r) => r.required) ? true : false);

  const ctxError = name ? ctx.errors[name] : undefined;
  const finalError = error ?? ctxError;
  const invalid = !!finalError;

  const hasMessage = !!(finalError || hint);
  const describedBy = hasMessage ? `${id}-hint` : undefined;

  const cls =
    'cf-field' +
    ` cf-field--${fieldLayout}` +
    (invalid ? ' cf-field--error' : '') +
    (className ? ` ${className}` : '');

  const labelStyle: CSSProperties | undefined =
    fieldLayout === 'horizontal' && ctx.labelWidth !== undefined
      ? {
          width: typeof ctx.labelWidth === 'number' ? `${ctx.labelWidth}px` : ctx.labelWidth,
          flex: '0 0 auto',
        }
      : undefined;

  useEffect(() => {
    if (name) ctx.registerField(name, rootRef.current);
    return () => {
      if (name) ctx.registerField(name, null);
    };
  }, [name, ctx]);

  const onFocusOut = useCallback(() => {
    if (name && ctx.validateOn === 'blur') void ctx.validateField(name);
  }, [name, ctx]);

  const renderedChildren =
    typeof children === 'function'
      ? children({ id, describedBy, invalid })
      : children;

  return (
    <div ref={rootRef} className={cls} onBlur={onFocusOut}>
      {label && (
        <label htmlFor={id} className="cf-field__label" style={labelStyle}>
          {label}
          {ruleRequired && <span className="cf-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="cf-field__control">
        {renderedChildren}
        {finalError ? (
          <p id={describedBy} className="cf-field__error" role="alert">{finalError}</p>
        ) : hint ? (
          <p id={describedBy} className="cf-field__hint">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
