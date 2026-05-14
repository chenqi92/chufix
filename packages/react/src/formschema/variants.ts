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
  options?: FormFieldOption[];
  span?: number;
  default?: unknown;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormSchemaProps<T = Record<string, unknown>> {
  fields: FormFieldDef[];
  value: T;
  onChange: (next: T) => void;
  errors?: Partial<Record<string, string>>;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  onFieldChange?: (name: string, value: unknown) => void;
}
