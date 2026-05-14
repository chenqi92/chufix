import type { FieldRowProps } from './variants';

export function FieldRow(props: FieldRowProps) {
  const {
    label,
    required = false,
    hint,
    error,
    htmlFor,
    layout = 'vertical',
    size = 'md',
    extraLabel,
    children,
  } = props;

  return (
    <div
      className={[
        'cf-fieldrow',
        `cf-fieldrow--${layout}`,
        `cf-fieldrow--${size}`,
        error ? 'has-error' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(label || extraLabel) && (
        <div className="cf-fieldrow__head">
          {label && (
            <label className="cf-fieldrow__label" htmlFor={htmlFor}>
              {label}
              {required && (
                <span className="cf-fieldrow__req" aria-hidden>
                  *
                </span>
              )}
            </label>
          )}
          {extraLabel && <span className="cf-fieldrow__extra">{extraLabel}</span>}
        </div>
      )}
      <div className="cf-fieldrow__control">{children}</div>
      {error ? (
        <p className="cf-fieldrow__error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="cf-fieldrow__hint">{hint}</p>
      ) : null}
    </div>
  );
}
