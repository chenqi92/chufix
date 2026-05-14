import { FieldRow } from '../fieldrow/FieldRow';
import type { FormFieldDef, FormSchemaProps } from './variants';

export function FormSchema<T extends Record<string, unknown>>(props: FormSchemaProps<T>) {
  const {
    fields,
    value,
    onChange,
    errors,
    disabled,
    layout = 'vertical',
    size = 'md',
    onFieldChange,
  } = props;

  function setField(name: string, v: unknown) {
    const next = { ...value, [name]: v } as T;
    onChange(next);
    onFieldChange?.(name, v);
  }

  function fieldId(name: string) {
    return `cf-form-${name}`;
  }

  return (
    <div className="cf-formschema">
      {fields.map((f) => (
        <FieldRow
          key={f.name}
          label={f.label}
          hint={f.hint}
          required={f.required}
          error={errors?.[f.name]}
          htmlFor={fieldId(f.name)}
          layout={layout}
          size={size}
        >
          {renderControl(f, value, setField, disabled, fieldId(f.name))}
        </FieldRow>
      ))}
    </div>
  );
}

function renderControl<T extends Record<string, unknown>>(
  f: FormFieldDef,
  value: T,
  setField: (name: string, v: unknown) => void,
  disabled: boolean | undefined,
  id: string,
) {
  const current = (value as Record<string, unknown>)[f.name];
  switch (f.type) {
    case 'text':
    case 'password':
      return (
        <input
          id={id}
          type={f.type}
          className="cf-input"
          placeholder={f.placeholder}
          disabled={disabled || f.disabled}
          value={(current as string | undefined) ?? ''}
          onChange={(e) => setField(f.name, e.target.value)}
        />
      );
    case 'number':
      return (
        <input
          id={id}
          type="number"
          className="cf-input"
          placeholder={f.placeholder}
          disabled={disabled || f.disabled}
          min={f.min}
          max={f.max}
          step={f.step}
          value={(current as number | undefined) ?? ''}
          onChange={(e) => setField(f.name, e.target.valueAsNumber)}
        />
      );
    case 'textarea':
      return (
        <textarea
          id={id}
          className="cf-textarea"
          placeholder={f.placeholder}
          disabled={disabled || f.disabled}
          value={(current as string | undefined) ?? ''}
          onChange={(e) => setField(f.name, e.target.value)}
        />
      );
    case 'select':
      return (
        <select
          id={id}
          className="cf-input"
          disabled={disabled || f.disabled}
          value={(current as string | number | undefined) ?? ''}
          onChange={(e) => setField(f.name, e.target.value)}
        >
          {f.placeholder && (
            <option value="" disabled>
              {f.placeholder}
            </option>
          )}
          {(f.options ?? []).map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case 'checkbox':
      return (
        <label className="cf-formschema__checkbox">
          <input
            id={id}
            type="checkbox"
            disabled={disabled || f.disabled}
            checked={Boolean(current)}
            onChange={(e) => setField(f.name, e.target.checked)}
          />
          <span>{f.placeholder ?? ''}</span>
        </label>
      );
    case 'switch':
      return (
        <label className="cf-formschema__switch">
          <input
            id={id}
            type="checkbox"
            role="switch"
            disabled={disabled || f.disabled}
            checked={Boolean(current)}
            onChange={(e) => setField(f.name, e.target.checked)}
          />
          <span className="cf-formschema__switch-track">
            <span className="cf-formschema__switch-thumb" />
          </span>
          {f.placeholder && <span className="cf-formschema__switch-label">{f.placeholder}</span>}
        </label>
      );
    case 'radio':
      return (
        <div className="cf-formschema__radio-group" role="radiogroup">
          {(f.options ?? []).map((opt) => (
            <label key={String(opt.value)} className="cf-formschema__radio">
              <input
                type="radio"
                name={f.name}
                value={String(opt.value)}
                checked={current === opt.value}
                disabled={disabled || f.disabled}
                onChange={() => setField(f.name, opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
}
