import { createContext, type ReactNode } from 'react';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';
export type FormSize = 'sm' | 'md' | 'lg';
export type ValidateTrigger = 'submit' | 'change' | 'blur';

export type FieldErrors = Record<string, string>;

export interface FieldRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  type?: 'string' | 'number' | 'email' | 'url' | 'array';
  validator?: (value: unknown, model: Record<string, unknown>) => string | void | Promise<string | void>;
  message?: string;
}

export type FieldRules = FieldRule[];

export interface FormProps {
  layout?: FormLayout;
  size?: FormSize;
  labelWidth?: number | string;
  disabled?: boolean;
  className?: string;
  /** Reactive values map. Required for rule-based validation. */
  model?: Record<string, unknown>;
  /** Called whenever the form mutates the model. The host component should
   *  treat the returned object as the new state. */
  onModelChange?: (next: Record<string, unknown>) => void;
  rules?: Record<string, FieldRules>;
  validateOn?: ValidateTrigger;
  scrollToError?: boolean;
  onSubmit?: (payload: { valid: boolean; values: Record<string, unknown>; errors: FieldErrors }) => void;
  onValidate?: (payload: { valid: boolean; errors: FieldErrors }) => void;
  onReset?: () => void;
  children?: ReactNode;
}

export interface FormContextValue {
  layout: FormLayout;
  size: FormSize;
  labelWidth?: number | string;
  disabled: boolean;
  model?: Record<string, unknown>;
  rules?: Record<string, FieldRules>;
  validateOn: ValidateTrigger;
  errors: FieldErrors;
  registerField: (name: string, el: HTMLElement | null) => void;
  validateField: (name: string) => Promise<string | void>;
}

export const FormContext = createContext<FormContextValue>({
  layout: 'vertical',
  size: 'md',
  labelWidth: undefined,
  disabled: false,
  validateOn: 'submit',
  errors: {},
  registerField: () => {},
  validateField: () => Promise.resolve(),
});

export interface FormFieldProps {
  name?: string;
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  layout?: FormLayout;
  className?: string;
  children?: ReactNode | ((ctx: { id: string; describedBy?: string; invalid: boolean }) => ReactNode);
}

export interface FormHandle {
  validate(): Promise<{ valid: boolean; errors: FieldErrors }>;
  validateField(name: string): Promise<string | void>;
  clearValidate(name?: string): void;
  resetFields(): void;
  submit(): Promise<void>;
}

export async function runRule(
  rule: FieldRule,
  value: unknown,
  model: Record<string, unknown>,
): Promise<string | undefined> {
  const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  if (rule.required && isEmpty) return rule.message ?? '此项必填';
  if (isEmpty && !rule.required) return undefined;

  if (rule.type === 'string' && typeof value !== 'string') return rule.message ?? '应为字符串';
  if (rule.type === 'number' && typeof value !== 'number') return rule.message ?? '应为数字';
  if (rule.type === 'array' && !Array.isArray(value)) return rule.message ?? '应为数组';
  if (rule.type === 'email' && (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
    return rule.message ?? '邮箱格式不正确';
  }
  if (rule.type === 'url') {
    try {
      new URL(String(value));
    } catch {
      return rule.message ?? '链接格式不正确';
    }
  }
  if (rule.min !== undefined) {
    const len = typeof value === 'string' ? value.length : Array.isArray(value) ? value.length : (value as number);
    if (typeof len === 'number' && len < rule.min) return rule.message ?? `不能少于 ${rule.min}`;
  }
  if (rule.max !== undefined) {
    const len = typeof value === 'string' ? value.length : Array.isArray(value) ? value.length : (value as number);
    if (typeof len === 'number' && len > rule.max) return rule.message ?? `不能超过 ${rule.max}`;
  }
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return rule.message ?? '格式不正确';
  }
  if (rule.validator) {
    const r = await rule.validator(value, model);
    if (typeof r === 'string') return r;
  }
  return undefined;
}

export async function validateRules(
  rules: FieldRules,
  value: unknown,
  model: Record<string, unknown>,
): Promise<string | undefined> {
  for (const rule of rules) {
    const err = await runRule(rule, value, model);
    if (err) return err;
  }
  return undefined;
}
