import type { InjectionKey, Ref } from 'vue';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';
export type FormSize = 'sm' | 'md' | 'lg';

export interface FormProps {
  layout?: FormLayout;
  size?: FormSize;
  /** Label width in horizontal layout. number → px; string passed through. */
  labelWidth?: number | string;
  disabled?: boolean;
}

export interface FormContext {
  layout: Ref<FormLayout>;
  size: Ref<FormSize>;
  labelWidth: Ref<number | string | undefined>;
  disabled: Ref<boolean>;
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('CfFormContext');

export interface FormFieldProps {
  label?: string;
  /** Marks the field as required (renders an asterisk). */
  required?: boolean;
  /** Helper text shown below the control. */
  hint?: string;
  /** Error text. When provided, replaces hint and styles control as invalid. */
  error?: string;
  /** Generated id for the control inside; auto-applies for/aria-describedby. */
  for?: string;
  /** Override layout from parent <Form>. */
  layout?: FormLayout;
}
