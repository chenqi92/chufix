<script setup lang="ts">
import { computed, inject, useId } from 'vue';
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

const hintId = computed(() => (props.hint || props.error ? `${fieldId.value}-hint` : undefined));
</script>

<template>
  <div
    :class="[
      'cf-field',
      `cf-field--${layout}`,
      error ? 'cf-field--error' : '',
    ]"
  >
    <label
      v-if="label"
      :for="fieldId"
      class="cf-field__label"
      :style="layout === 'horizontal' && labelWidth ? { width: labelWidth, flex: '0 0 auto' } : undefined"
    >
      {{ label }}
      <span v-if="required" class="cf-field__required" aria-hidden="true">*</span>
    </label>
    <div class="cf-field__control">
      <slot :id="fieldId" :describedBy="hintId" :invalid="!!error" />
      <p v-if="error" :id="hintId" class="cf-field__error" role="alert">{{ error }}</p>
      <p v-else-if="hint" :id="hintId" class="cf-field__hint">{{ hint }}</p>
    </div>
  </div>
</template>
