import { FormContext, type FormProps } from './variants';

export function Form(props: FormProps) {
  const {
    layout = 'vertical',
    size = 'md',
    labelWidth,
    disabled = false,
    className,
    onSubmit,
    children,
  } = props;

  const ctx = { layout, size, labelWidth, disabled };
  const cls = `cf-form cf-form--${layout} cf-form--${size}` + (className ? ` ${className}` : '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (onSubmit) onSubmit(e);
    else e.preventDefault();
  }

  return (
    <FormContext.Provider value={ctx}>
      <form className={cls} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
