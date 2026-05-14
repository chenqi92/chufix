import { computed, reactive, ref } from 'vue';

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
  /** When to auto-run validation. Default 'submit'. */
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

/**
 * Light schema-driven form validation.
 *
 * `schema` is `{ fieldName: validator(s) }`; each validator returns the error
 * string or undefined. Validators may be async. No external dependency.
 */
export function useFormValidation<T extends Record<string, unknown>>(
  options: UseFormValidationOptions<T>,
): FormApi<T> {
  const initial = { ...options.initialValues };
  const values = reactive<T>({ ...options.initialValues }) as T;
  const errors = reactive<Partial<Record<keyof T, string>>>({}) as Partial<Record<keyof T, string>>;
  const touched = reactive<Partial<Record<keyof T, boolean>>>({}) as Partial<Record<keyof T, boolean>>;
  const isSubmitting = ref(false);
  const mode: ValidateMode = options.validateOn ?? 'submit';

  async function runField(field: keyof T): Promise<string | undefined> {
    const fieldSchema = options.schema?.[field];
    if (!fieldSchema) return undefined;
    const validators = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
    for (const v of validators) {
      const result = await Promise.resolve(v(values[field], { values: values as T }));
      if (result) return result;
    }
    return undefined;
  }

  async function validate(field?: keyof T): Promise<boolean> {
    if (field) {
      const err = await runField(field);
      if (err) errors[field] = err;
      else delete errors[field];
      return !err;
    }
    let ok = true;
    const fields = options.schema ? (Object.keys(options.schema) as (keyof T)[]) : ([] as (keyof T)[]);
    await Promise.all(
      fields.map(async (f) => {
        const err = await runField(f);
        if (err) {
          errors[f] = err;
          ok = false;
        } else {
          delete errors[f];
        }
      }),
    );
    return ok;
  }

  function setValue<K extends keyof T>(field: K, value: T[K]) {
    values[field] = value;
    if (mode === 'change' || (mode === 'blur' && touched[field])) {
      void validate(field);
    } else if (errors[field]) {
      void validate(field);
    }
  }

  function setError<K extends keyof T>(field: K, error?: string) {
    if (error) errors[field] = error;
    else delete errors[field];
  }

  function setTouched<K extends keyof T>(field: K, t = true) {
    touched[field] = t;
    if (t && mode === 'blur') void validate(field);
  }

  function reset(next?: T) {
    const src = next ?? initial;
    for (const k of Object.keys(values) as (keyof T)[]) {
      (values as Record<string, unknown>)[k as string] = (src as Record<string, unknown>)[k as string];
    }
    for (const k of Object.keys(errors) as (keyof T)[]) delete errors[k];
    for (const k of Object.keys(touched) as (keyof T)[]) delete touched[k];
    isSubmitting.value = false;
  }

  async function submit(handler: (values: T) => unknown | Promise<unknown>) {
    if (isSubmitting.value) return;
    for (const k of options.schema ? (Object.keys(options.schema) as (keyof T)[]) : ([] as (keyof T)[])) {
      touched[k] = true;
    }
    const ok = await validate();
    if (!ok) return;
    isSubmitting.value = true;
    try {
      await handler(values as T);
    } finally {
      isSubmitting.value = false;
    }
  }

  const isValid = computed(() => Object.keys(errors).length === 0);
  const isDirty = computed(() => {
    for (const k of Object.keys(values) as (keyof T)[]) {
      if ((values as Record<string, unknown>)[k as string] !== (initial as Record<string, unknown>)[k as string]) return true;
    }
    return false;
  });

  return new Proxy({} as FormApi<T>, {
    get(_t, prop) {
      if (prop === 'values') return values;
      if (prop === 'errors') return errors;
      if (prop === 'touched') return touched;
      if (prop === 'isValid') return isValid.value;
      if (prop === 'isDirty') return isDirty.value;
      if (prop === 'isSubmitting') return isSubmitting.value;
      if (prop === 'setValue') return setValue;
      if (prop === 'setError') return setError;
      if (prop === 'setTouched') return setTouched;
      if (prop === 'validate') return validate;
      if (prop === 'reset') return reset;
      if (prop === 'submit') return submit;
      return undefined;
    },
  });
}
