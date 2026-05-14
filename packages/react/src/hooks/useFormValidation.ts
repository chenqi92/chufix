import { useCallback, useMemo, useRef, useState } from 'react';

export type Validator<T> = (
  value: unknown,
  ctx: { values: T },
) => string | undefined | Promise<string | undefined>;

export type FieldSchema<T> = Validator<T> | Validator<T>[];

export type FormSchema<T> = { [field in keyof T]?: FieldSchema<T> };

export type ValidateMode = 'change' | 'blur' | 'submit';

export interface UseFormValidationOptions<T extends Record<string, unknown>> {
  initialValues: T;
  schema?: FormSchema<T>;
  validateOn?: ValidateMode;
}

export interface FormApi<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  setValue<K extends keyof T>(field: K, value: T[K]): void;
  setError<K extends keyof T>(field: K, error?: string): void;
  setTouched<K extends keyof T>(field: K, touched?: boolean): void;
  validate(field?: keyof T): Promise<boolean>;
  reset(values?: T): void;
  submit(handler: (values: T) => unknown | Promise<unknown>): Promise<void>;
}

export function useFormValidation<T extends Record<string, unknown>>(
  options: UseFormValidationOptions<T>,
): FormApi<T> {
  const initialRef = useRef({ ...options.initialValues });
  const [values, setValues] = useState<T>({ ...options.initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const mode: ValidateMode = options.validateOn ?? 'submit';
  const schemaRef = useRef(options.schema);
  schemaRef.current = options.schema;

  const runField = useCallback(
    async (field: keyof T): Promise<string | undefined> => {
      const fieldSchema = schemaRef.current?.[field];
      if (!fieldSchema) return undefined;
      const validators = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
      for (const v of validators) {
        const result = await Promise.resolve(v(valuesRef.current[field], { values: valuesRef.current }));
        if (result) return result;
      }
      return undefined;
    },
    [],
  );

  const validate = useCallback(
    async (field?: keyof T): Promise<boolean> => {
      if (field) {
        const err = await runField(field);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next[field] = err;
          else delete next[field];
          return next;
        });
        return !err;
      }
      const fields = schemaRef.current ? (Object.keys(schemaRef.current) as (keyof T)[]) : ([] as (keyof T)[]);
      const entries = await Promise.all(fields.map(async (f) => [f, await runField(f)] as const));
      let ok = true;
      const nextErrors: Partial<Record<keyof T, string>> = {};
      for (const [f, err] of entries) {
        if (err) {
          nextErrors[f] = err;
          ok = false;
        }
      }
      setErrors(nextErrors);
      return ok;
    },
    [runField],
  );

  const touchedRef = useRef(touched);
  touchedRef.current = touched;
  const errorsRef = useRef(errors);
  errorsRef.current = errors;

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (mode === 'change' || (mode === 'blur' && touchedRef.current[field]) || errorsRef.current[field]) {
      // queue micro-task so values state has updated
      queueMicrotask(() => validate(field));
    }
  }, [mode, validate]);

  const setError = useCallback(<K extends keyof T>(field: K, error?: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  }, []);

  const setTouchedFn = useCallback(<K extends keyof T>(field: K, t = true) => {
    setTouched((prev) => ({ ...prev, [field]: t }));
    if (t && mode === 'blur') void validate(field);
  }, [mode, validate]);

  const reset = useCallback((next?: T) => {
    const src = next ?? initialRef.current;
    if (next) initialRef.current = { ...next };
    setValues({ ...src });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const submit = useCallback(async (handler: (values: T) => unknown | Promise<unknown>) => {
    if (isSubmitting) return;
    const allFields = schemaRef.current ? (Object.keys(schemaRef.current) as (keyof T)[]) : ([] as (keyof T)[]);
    setTouched((prev) => {
      const next = { ...prev };
      for (const f of allFields) next[f] = true;
      return next;
    });
    const ok = await validate();
    if (!ok) return;
    setIsSubmitting(true);
    try {
      await handler(valuesRef.current);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validate]);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = useMemo(() => {
    for (const k of Object.keys(values) as (keyof T)[]) {
      if ((values as Record<string, unknown>)[k as string] !== (initialRef.current as Record<string, unknown>)[k as string]) return true;
    }
    return false;
  }, [values]);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    setValue,
    setError,
    setTouched: setTouchedFn,
    validate,
    reset,
    submit,
  };
}
