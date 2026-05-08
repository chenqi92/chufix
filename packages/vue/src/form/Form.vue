<script setup lang="ts">
import { provide, toRef } from 'vue';
import { FormContextKey, type FormProps } from './variants';

const props = withDefaults(defineProps<FormProps>(), {
  layout: 'vertical',
  size: 'md',
  disabled: false,
});

provide(FormContextKey, {
  layout: toRef(props, 'layout'),
  size: toRef(props, 'size'),
  labelWidth: toRef(props, 'labelWidth'),
  disabled: toRef(props, 'disabled'),
});
</script>

<template>
  <form
    :class="['cf-form', `cf-form--${layout}`, `cf-form--${size}`]"
    @submit.prevent
  >
    <slot />
  </form>
</template>
