import { useState } from 'react';
import type { ToggleGroupProps, ToggleOption } from './variants';

export function ToggleGroup(props: ToggleGroupProps) {
  const {
    options,
    value,
    defaultValue,
    mode = 'single',
    orientation = 'horizontal',
    size,
    variant = 'attached',
    disabled = false,
    ariaLabel,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    defaultValue ?? (mode === 'multi' ? [] : null),
  );
  const currentValue = isControlled ? value : internalValue;

  const cls = [
    'cf-btn-group',
    `cf-btn-group--${orientation}`,
    `cf-btn-group--${variant}`,
    size ? `cf-btn-group--${size}` : '',
    'cf-toggle-group',
    `cf-toggle-group--${mode}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function isPressed(opt: ToggleOption): boolean {
    if (mode === 'multi') {
      return Array.isArray(currentValue) && currentValue.includes(opt.value);
    }
    return currentValue === opt.value;
  }

  function toggle(opt: ToggleOption) {
    if (disabled || opt.disabled) return;
    let next: string | string[] | null;
    if (mode === 'multi') {
      const arr = Array.isArray(currentValue) ? [...currentValue] : [];
      const idx = arr.indexOf(opt.value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(opt.value);
      next = arr;
    } else {
      next = currentValue === opt.value ? null : opt.value;
    }
    if (!isControlled) setInternalValue(next);
    onChange?.({ value: next, changedValue: opt.value });
  }

  return (
    <div className={cls} role="group" aria-label={ariaLabel} aria-orientation={orientation}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="cf-btn cf-btn--tertiary cf-toggle-group__item"
          aria-pressed={isPressed(opt)}
          disabled={disabled || opt.disabled}
          onClick={() => toggle(opt)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
