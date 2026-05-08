import type { InjectionKey } from 'vue';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioValue = string | number | boolean | null;

export interface RadioProps {
  value: RadioValue;
  modelValue?: RadioValue;
  size?: RadioSize;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export interface RadioGroupProps {
  modelValue?: RadioValue;
  name?: string;
  size?: RadioSize;
  disabled?: boolean;
  direction?: 'row' | 'column';
}

export interface RadioGroupContext {
  value: { readonly current: RadioValue };
  name: string | undefined;
  size: RadioSize;
  disabled: boolean;
  select(v: RadioValue): void;
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('cf-radio-group');

export function radioClass(p: {
  size: RadioSize;
  disabled: boolean;
  checked: boolean;
}): string {
  return [
    'cf-radio',
    `cf-radio--${p.size}`,
    p.disabled && 'is-disabled',
    p.checked && 'is-checked',
  ]
    .filter(Boolean)
    .join(' ');
}

export function radioGroupClass(p: { direction: 'row' | 'column' }): string {
  return ['cf-radio-group', `cf-radio-group--${p.direction}`].join(' ');
}
