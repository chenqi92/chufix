import { createContext, type ReactNode } from 'react';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';
export type FormSize = 'sm' | 'md' | 'lg';

export interface FormProps {
  layout?: FormLayout;
  size?: FormSize;
  labelWidth?: number | string;
  disabled?: boolean;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
}

export interface FormContextValue {
  layout: FormLayout;
  size: FormSize;
  labelWidth?: number | string;
  disabled: boolean;
}

export const FormContext = createContext<FormContextValue>({
  layout: 'vertical',
  size: 'md',
  labelWidth: undefined,
  disabled: false,
});

export interface FormFieldProps {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  layout?: FormLayout;
  className?: string;
  children?: ReactNode | ((ctx: { id: string; describedBy?: string; invalid: boolean }) => ReactNode);
}
