import { createContext, useState } from 'react';
import {
  radioGroupClass,
  type RadioChangeMeta,
  type RadioGroupProps,
  type RadioSize,
  type RadioValue,
} from './variants';

export interface RadioGroupContextValue {
  value: RadioValue;
  name?: string;
  size: RadioSize;
  disabled: boolean;
  select(v: RadioValue, meta: RadioChangeMeta): void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroup(props: RadioGroupProps) {
  const {
    value,
    defaultValue = null,
    name,
    size = 'md',
    disabled = false,
    direction = 'row',
    onChange,
    children,
    className,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<RadioValue>(defaultValue);
  const current = isControlled ? (value as RadioValue) : internal;

  function select(v: RadioValue, meta: RadioChangeMeta) {
    if (!isControlled) setInternal(v);
    onChange?.(v, meta);
  }

  return (
    <div
      role="radiogroup"
      className={radioGroupClass({ direction, className })}
    >
      <RadioGroupContext.Provider
        value={{ value: current, name, size, disabled, select }}
      >
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}
