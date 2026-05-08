import { useContext, useId, type CSSProperties } from 'react';
import { FormContext, type FormFieldProps } from './variants';

export function FormField(props: FormFieldProps) {
  const { label, required, hint, error, htmlFor, layout, className, children } = props;
  const ctx = useContext(FormContext);
  const id = htmlFor ?? `cf-field-${useId()}`;
  const fieldLayout = layout ?? ctx.layout;

  const hasMessage = !!(error || hint);
  const describedBy = hasMessage ? `${id}-hint` : undefined;
  const invalid = !!error;

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

  const renderedChildren =
    typeof children === 'function'
      ? children({ id, describedBy, invalid })
      : children;

  return (
    <div className={cls}>
      {label && (
        <label htmlFor={id} className="cf-field__label" style={labelStyle}>
          {label}
          {required && <span className="cf-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="cf-field__control">
        {renderedChildren}
        {error ? (
          <p id={describedBy} className="cf-field__error" role="alert">{error}</p>
        ) : hint ? (
          <p id={describedBy} className="cf-field__hint">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
