<script setup lang="ts">
import { computed, ref } from 'vue';
import { inputClass, type InputProps } from './variants';

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  variant: 'outline',
  size: 'md',
  disabled: false,
  readonly: false,
  error: false,
  clearable: false,
  autofocus: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'clear'): void;
}>();

const focused = ref(false);
const nativeRef = ref<HTMLInputElement | null>(null);

const cls = computed(() =>
  inputClass({
    variant: props.variant,
    size: props.size,
    focused: focused.value,
    disabled: props.disabled,
    error: props.error,
  }),
);

const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    String(props.modelValue ?? '').length > 0,
);

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  emit('update:modelValue', v);
}
function onChange(e: Event) {
  emit('change', (e.target as HTMLInputElement).value);
}
function onFocus(e: FocusEvent) {
  focused.value = true;
  emit('focus', e);
}
function onBlur(e: FocusEvent) {
  focused.value = false;
  emit('blur', e);
}
function onClear() {
  emit('update:modelValue', '');
  emit('clear');
  nativeRef.value?.focus();
}
function focusInput() {
  nativeRef.value?.focus();
}
</script>

<template>
  <label :class="cls" @click="focusInput">
    <span v-if="$slots.prefix" class="ck-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      ref="nativeRef"
      class="ck-input__native"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :id="id"
      :autofocus="autofocus"
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    />
    <button
      v-if="showClear"
      type="button"
      class="ck-input__clear"
      tabindex="-1"
      aria-label="清空"
      @click.stop="onClear"
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
    <span v-else-if="$slots.suffix" class="ck-input__suffix">
      <slot name="suffix" />
    </span>
  </label>
</template>
