<script setup lang="ts">
import { computed } from 'vue';
import { switchClass, type SwitchChangeMeta, type SwitchProps } from './variants';

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  size: 'md',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean, meta: SwitchChangeMeta): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const cls = computed(() =>
  switchClass({
    size: props.size,
    disabled: props.disabled,
    loading: props.loading,
  }),
);

const isInactive = computed(() => props.disabled || props.loading);

function onChange(e: Event) {
  if (isInactive.value) return;
  const v = (e.target as HTMLInputElement).checked;
  emit('update:modelValue', v);
  emit('change', v, { event: e, checked: v, name: props.name });
}
</script>

<template>
  <label :class="cls">
    <input
      class="cf-switch__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="isInactive"
      :name="name"
      :id="id"
      role="switch"
      :aria-checked="modelValue"
      @change="onChange"
      @focus="(event) => emit('focus', event)"
      @blur="(event) => emit('blur', event)"
    />
    <span class="cf-switch__track">
      <span class="cf-switch__thumb" />
    </span>
    <span v-if="$slots.default"><slot /></span>
  </label>
</template>
