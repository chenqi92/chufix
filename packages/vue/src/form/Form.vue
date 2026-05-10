<script setup lang="ts">
import { provide, ref, toRef } from 'vue';
import {
  FormContextKey,
  validateRules,
  type FieldErrors,
  type FormProps,
} from './variants';

const props = withDefaults(defineProps<FormProps>(), {
  layout: 'vertical',
  size: 'md',
  disabled: false,
  validateOn: 'submit',
  scrollToError: true,
});

const emit = defineEmits<{
  (e: 'submit', payload: { valid: boolean; values: Record<string, unknown>; errors: FieldErrors }): void;
  (e: 'reset'): void;
  (e: 'validate', payload: { valid: boolean; errors: FieldErrors }): void;
}>();

const errors = ref<FieldErrors>({});
const fieldRefs = new Map<string, HTMLElement>();
const initialModelSnapshot = props.model ? structuredClone(props.model) : undefined;

function registerField(name: string, el: HTMLElement) {
  fieldRefs.set(name, el);
}
function unregisterField(name: string) {
  fieldRefs.delete(name);
}

function setError(name: string, msg: string | undefined) {
  if (msg) {
    errors.value = { ...errors.value, [name]: msg };
  } else {
    if (!(name in errors.value)) return;
    const next = { ...errors.value };
    delete next[name];
    errors.value = next;
  }
}

async function validateField(name: string): Promise<string | void> {
  const rules = props.rules?.[name];
  const model = props.model ?? {};
  if (!rules) {
    setError(name, undefined);
    return undefined;
  }
  const err = await validateRules(rules, model[name], model);
  setError(name, err);
  return err;
}

async function validate(): Promise<{ valid: boolean; errors: FieldErrors }> {
  if (!props.rules || !props.model) {
    return { valid: true, errors: {} };
  }
  const next: FieldErrors = {};
  const names = Object.keys(props.rules);
  await Promise.all(
    names.map(async (n) => {
      const r = props.rules![n];
      const err = await validateRules(r, props.model![n], props.model!);
      if (err) next[n] = err;
    }),
  );
  errors.value = next;
  const valid = Object.keys(next).length === 0;
  emit('validate', { valid, errors: next });
  if (!valid && props.scrollToError) {
    const firstName = names.find((n) => next[n]);
    if (firstName) {
      const el = fieldRefs.get(firstName);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusable = el?.querySelector<HTMLElement>(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus({ preventScroll: true });
    }
  }
  return { valid, errors: next };
}

function clearValidate(name?: string) {
  if (name) {
    setError(name, undefined);
  } else {
    errors.value = {};
  }
}

function resetFields() {
  if (props.model && initialModelSnapshot) {
    for (const k of Object.keys(props.model)) {
      delete (props.model as Record<string, unknown>)[k];
    }
    Object.assign(props.model as Record<string, unknown>, structuredClone(initialModelSnapshot));
  }
  errors.value = {};
  emit('reset');
}

async function submit() {
  if (!props.rules || !props.model) {
    emit('submit', { valid: true, values: props.model ?? {}, errors: {} });
    return;
  }
  const { valid, errors: errs } = await validate();
  emit('submit', { valid, values: props.model, errors: errs });
}

function onFormSubmit(e: Event) {
  e.preventDefault();
  void submit();
}

provide(FormContextKey, {
  layout: toRef(props, 'layout'),
  size: toRef(props, 'size'),
  labelWidth: toRef(props, 'labelWidth'),
  disabled: toRef(props, 'disabled'),
  model: toRef(props, 'model'),
  rules: toRef(props, 'rules'),
  validateOn: toRef(props, 'validateOn'),
  errors,
  registerField,
  unregisterField,
  validateField,
  setError,
});

defineExpose({ validate, validateField, clearValidate, resetFields, submit });
</script>

<template>
  <form
    :class="['cf-form', `cf-form--${layout}`, `cf-form--${size}`]"
    @submit="onFormSubmit"
  >
    <slot />
  </form>
</template>
