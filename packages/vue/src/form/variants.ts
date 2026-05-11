import type { InjectionKey, Ref } from 'vue';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';
export type FormSize = 'sm' | 'md' | 'lg';
export type ValidateTrigger = 'submit' | 'change' | 'blur';

export type FieldErrors = Record<string, string>;

export interface FieldRule {
  /** The field is required (not undefined / null / empty string / empty array). */
  required?: boolean;
  /** Min length for strings; min size for arrays. */
  min?: number;
  /** Max length for strings; max size for arrays. */
  max?: number;
  /** Regex the value must match (string only). */
  pattern?: RegExp;
  /** Type check helper. */
  type?: 'string' | 'number' | 'email' | 'url' | 'array';
  /** Custom validator. Return error message string, or void/undefined for OK. May be async. */
  validator?: (value: unknown, model: Record<string, unknown>) => string | void | Promise<string | void>;
  /** Override the default English message for this rule. */
  message?: string;
}

export type FieldRules = FieldRule[];

export interface FormProps {
  layout?: FormLayout;
  size?: FormSize;
  /** Label width in horizontal layout. number → px; string passed through. */
  labelWidth?: number | string;
  disabled?: boolean;
  /** Reactive data source. When provided alongside rules + named fields, the
   *  Form will run rule-based validation and expose imperative methods. */
  model?: Record<string, unknown>;
  /** Map of field name → rule list. */
  rules?: Record<string, FieldRules>;
  /** When to run rule validation. Default 'submit'. */
  validateOn?: ValidateTrigger;
  /** Auto-scroll to first invalid field on submit. Default true. */
  scrollToError?: boolean;
}

export interface FormContext {
  layout: Ref<FormLayout>;
  size: Ref<FormSize>;
  labelWidth: Ref<number | string | undefined>;
  disabled: Ref<boolean>;
  model: Ref<Record<string, unknown> | undefined>;
  rules: Ref<Record<string, FieldRules> | undefined>;
  validateOn: Ref<ValidateTrigger>;
  errors: Ref<FieldErrors>;
  registerField: (name: string, el: HTMLElement) => void;
  unregisterField: (name: string) => void;
  validateField: (name: string) => Promise<string | void>;
  setError: (name: string, msg: string | undefined) => void;
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('CfFormContext');

export interface FormFieldProps {
  /** Field name, used to bind to model[name] + rules[name]. */
  name?: string;
  label?: string;
  /** Marks the field as required (renders an asterisk). */
  required?: boolean;
  /** Helper text shown below the control. */
  hint?: string;
  /** Error text. When provided, replaces hint and styles control as invalid.
   *  Leave undefined to let parent <Form> drive the error via rules. */
  error?: string;
  /** Generated id for the control inside; auto-applies for/aria-describedby. */
  for?: string;
  /** Override layout from parent <Form>. */
  layout?: FormLayout;
}

/** Run a single rule against a value. Returns error message or undefined. */
export async function runRule(
  rule: FieldRule,
  value: unknown,
  model: Record<string, unknown>,
): Promise<string | undefined> {
  const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  if (rule.required && isEmpty) {
    return rule.message ?? '此项必填';
  }
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
    if (typeof len === 'number' && len < rule.min) {
      return rule.message ?? `不能少于 ${rule.min}`;
    }
  }
  if (rule.max !== undefined) {
    const len = typeof value === 'string' ? value.length : Array.isArray(value) ? value.length : (value as number);
    if (typeof len === 'number' && len > rule.max) {
      return rule.message ?? `不能超过 ${rule.max}`;
    }
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
