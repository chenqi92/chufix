<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useId, watch } from 'vue';
import { FormContextKey, type FormFieldProps } from './variants';

const props = withDefaults(defineProps<FormFieldProps>(), {});

const ctx = inject(FormContextKey, null);
const fieldId = computed(() => props.for ?? `cf-field-${useId()}`);
const layout = computed(() => props.layout ?? ctx?.layout.value ?? 'vertical');
const labelWidth = computed(() => {
  const w = ctx?.labelWidth.value;
  if (w === undefined) return undefined;
  return typeof w === 'number' ? `${w}px` : w;
});

/* required is auto-derived if a `required: true` rule exists on this field. */
const isRequired = computed<boolean>(() => {
  if (props.required) return true;
  if (props.name && ctx?.rules.value?.[props.name]) {
    return ctx.rules.value[props.name].some((r) => r.required);
  }
  return false;
});

/* Error: explicit prop wins; otherwise pull from form context. */
const computedError = computed<string | undefined>(() => {
  if (props.error) return props.error;
  if (props.name && ctx) return ctx.errors.value[props.name];
  return undefined;
});

const hintId = computed(() =>
  computedError.value || props.hint ? `${fieldId.value}-hint` : undefined,
);

/* Track the field root for scroll-to-error. */
const rootRef = ref<HTMLDivElement | null>(null);
watch(rootRef, (el) => {
  if (props.name && ctx) {
    if (el) ctx.registerField(props.name, el);
  }
});
onBeforeUnmount(() => {
  if (props.name && ctx) ctx.unregisterField(props.name);
});

/* Validate on change/blur if context says so. */
function maybeValidate(trigger: 'change' | 'blur') {
  if (!props.name || !ctx) return;
  if (ctx.validateOn.value === trigger) {
    void ctx.validateField(props.name);
  }
}

/* When the bound model[name] changes, re-validate (only if validateOn === change). */
watch(
  () => (props.name && ctx?.model.value ? (ctx.model.value as Record<string, unknown>)[props.name] : undefined),
  () => maybeValidate('change'),
);
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      'cf-field',
      `cf-field--${layout}`,
      computedError ? 'cf-field--error' : '',
    ]"
    @focusout="maybeValidate('blur')"
  >
    <label
      v-if="label"
      :for="fieldId"
      class="cf-field__label"
      :style="layout === 'horizontal' && labelWidth ? { width: labelWidth, flex: '0 0 auto' } : undefined"
    >
      {{ label }}
      <span v-if="isRequired" class="cf-field__required" aria-hidden="true">*</span>
    </label>
    <div class="cf-field__control">
      <slot :id="fieldId" :describedBy="hintId" :invalid="!!computedError" />
      <p v-if="computedError" :id="hintId" class="cf-field__error" role="alert">{{ computedError }}</p>
      <p v-else-if="hint" :id="hintId" class="cf-field__hint">{{ hint }}</p>
    </div>
  </div>
</template>
