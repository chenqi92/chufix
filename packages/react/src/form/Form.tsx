import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  FormContext,
  validateRules,
  type FieldErrors,
  type FormHandle,
  type FormProps,
} from './variants';

export const Form = forwardRef<FormHandle, FormProps>(function Form(props, ref) {
  const {
    layout = 'vertical',
    size = 'md',
    labelWidth,
    disabled = false,
    className,
    model,
    rules,
    validateOn = 'submit',
    scrollToError = true,
    onSubmit,
    onValidate,
    onReset,
    children,
  } = props;

  const [errors, setErrors] = useState<FieldErrors>({});
  const fieldRefs = useRef(new Map<string, HTMLElement>());
  const initialModelRef = useRef<Record<string, unknown> | undefined>(
    model ? structuredClone(model) : undefined,
  );

  const registerField = useCallback((name: string, el: HTMLElement | null) => {
    if (el) fieldRefs.current.set(name, el);
    else fieldRefs.current.delete(name);
  }, []);

  const setError = useCallback((name: string, msg: string | undefined) => {
    setErrors((prev) => {
      if (msg) return { ...prev, [name]: msg };
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const validateField = useCallback(
    async (name: string): Promise<string | void> => {
      const r = rules?.[name];
      const m = model ?? {};
      if (!r) {
        setError(name, undefined);
        return undefined;
      }
      const err = await validateRules(r, m[name], m);
      setError(name, err);
      return err;
    },
    [rules, model, setError],
  );

  const validate = useCallback(async (): Promise<{ valid: boolean; errors: FieldErrors }> => {
    if (!rules || !model) return { valid: true, errors: {} };
    const next: FieldErrors = {};
    const names = Object.keys(rules);
    await Promise.all(
      names.map(async (n) => {
        const err = await validateRules(rules[n], model[n], model);
        if (err) next[n] = err;
      }),
    );
    setErrors(next);
    const valid = Object.keys(next).length === 0;
    onValidate?.({ valid, errors: next });
    if (!valid && scrollToError) {
      const firstName = names.find((n) => next[n]);
      if (firstName) {
        const el = fieldRefs.current.get(firstName);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = el?.querySelector<HTMLElement>(
          'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
        );
        focusable?.focus({ preventScroll: true });
      }
    }
    return { valid, errors: next };
  }, [rules, model, onValidate, scrollToError]);

  const clearValidate = useCallback((name?: string) => {
    if (name) setError(name, undefined);
    else setErrors({});
  }, [setError]);

  const resetFields = useCallback(() => {
    if (model && initialModelRef.current) {
      for (const k of Object.keys(model)) delete model[k];
      Object.assign(model, structuredClone(initialModelRef.current));
    }
    setErrors({});
    onReset?.();
  }, [model, onReset]);

  const submit = useCallback(async () => {
    if (!rules || !model) {
      onSubmit?.({ valid: true, values: model ?? {}, errors: {} });
      return;
    }
    const { valid, errors: errs } = await validate();
    onSubmit?.({ valid, values: model, errors: errs });
  }, [rules, model, onSubmit, validate]);

  useImperativeHandle(ref, () => ({ validate, validateField, clearValidate, resetFields, submit }), [
    validate,
    validateField,
    clearValidate,
    resetFields,
    submit,
  ]);

  const contextValue = useMemo(
    () => ({
      layout,
      size,
      labelWidth,
      disabled,
      model,
      rules,
      validateOn,
      errors,
      registerField,
      validateField,
    }),
    [layout, size, labelWidth, disabled, model, rules, validateOn, errors, registerField, validateField],
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit();
  }

  const cls = `cf-form cf-form--${layout} cf-form--${size}` + (className ? ` ${className}` : '');

  return (
    <FormContext.Provider value={contextValue}>
      <form className={cls} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
});
