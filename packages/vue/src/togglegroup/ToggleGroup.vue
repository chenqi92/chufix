<script setup lang="ts">
import { computed } from 'vue';
import type {
  ToggleGroupChangePayload,
  ToggleGroupProps,
  ToggleOption,
} from './variants';

const props = withDefaults(defineProps<ToggleGroupProps>(), {
  mode: 'single',
  orientation: 'horizontal',
  variant: 'attached',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | null): void;
  (e: 'change', payload: ToggleGroupChangePayload): void;
}>();

const cls = computed(() =>
  [
    'cf-btn-group',
    `cf-btn-group--${props.orientation}`,
    `cf-btn-group--${props.variant}`,
    props.size ? `cf-btn-group--${props.size}` : '',
    'cf-toggle-group',
    `cf-toggle-group--${props.mode}`,
  ]
    .filter(Boolean)
    .join(' '),
);

function isPressed(opt: ToggleOption): boolean {
  if (props.mode === 'multi') {
    return Array.isArray(props.modelValue) && props.modelValue.includes(opt.value);
  }
  return props.modelValue === opt.value;
}

function toggle(opt: ToggleOption) {
  if (props.disabled || opt.disabled) return;
  if (props.mode === 'multi') {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const idx = current.indexOf(opt.value);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(opt.value);
    emit('update:modelValue', current);
    emit('change', { value: current, changedValue: opt.value });
  } else {
    const next = props.modelValue === opt.value ? null : opt.value;
    emit('update:modelValue', next);
    emit('change', { value: next, changedValue: opt.value });
  }
}
</script>

<template>
  <div :class="cls" role="group" :aria-label="ariaLabel" :aria-orientation="orientation">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="cf-btn cf-btn--tertiary cf-toggle-group__item"
      :aria-pressed="isPressed(opt)"
      :disabled="disabled || opt.disabled"
      @click="toggle(opt)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
