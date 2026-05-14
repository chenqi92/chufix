<script setup lang="ts">
import type { FieldRowProps } from './variants';

const props = withDefaults(defineProps<FieldRowProps>(), {
  layout: 'vertical',
  size: 'md',
  required: false,
});
</script>

<template>
  <div
    :class="[
      'cf-fieldrow',
      `cf-fieldrow--${layout}`,
      `cf-fieldrow--${size}`,
      error && 'has-error',
    ]"
  >
    <div v-if="label || extraLabel" class="cf-fieldrow__head">
      <label v-if="label" class="cf-fieldrow__label" :for="htmlFor">
        {{ label }}
        <span v-if="required" class="cf-fieldrow__req" aria-hidden="true">*</span>
      </label>
      <span v-if="extraLabel" class="cf-fieldrow__extra">{{ extraLabel }}</span>
    </div>
    <div class="cf-fieldrow__control">
      <slot />
    </div>
    <p v-if="error" class="cf-fieldrow__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="cf-fieldrow__hint">{{ hint }}</p>
  </div>
</template>
