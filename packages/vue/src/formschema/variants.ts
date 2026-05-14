export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'password';

export interface FormFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface FormFieldDef {
  name: string;
  label: string;
  type: FormFieldType;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** For select / radio. */
  options?: FormFieldOption[];
  /** Grid span (number of columns) within FormGrid; default 1. */
  span?: number;
  /** Optional default value. */
  default?: unknown;
  /** Optional min / max (number type). */
  min?: number;
  max?: number;
  /** Step (number type). */
  step?: number;
}

export interface FormSchemaProps<T = Record<string, unknown>> {
  fields: FormFieldDef[];
  modelValue: T;
  errors?: Partial<Record<string, string>>;
  /** Disable all fields. */
  disabled?: boolean;
  /** Vertical / horizontal label layout. */
  layout?: 'vertical' | 'horizontal';
  /** Field row size preset. */
  size?: 'sm' | 'md' | 'lg';
}
