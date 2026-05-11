<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  radioClass,
  radioGroupKey,
  type RadioChangeMeta,
  type RadioProps,
  type RadioValue,
} from './variants';

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: null,
  size: 'md',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: RadioValue): void;
  (e: 'change', value: RadioValue, meta: RadioChangeMeta): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const group = inject(radioGroupKey, null);

const size = computed(() => group?.size ?? props.size);
const disabled = computed(() => group?.disabled || props.disabled);
const name = computed(() => group?.name ?? props.name);
const checked = computed(() => {
  const current = group ? group.value.current : props.modelValue;
  return current === props.value;
});

const cls = computed(() =>
  radioClass({
    size: size.value,
    disabled: disabled.value,
    checked: checked.value,
  }),
);

function onChange(e: Event) {
  if (disabled.value) return;
  const meta = {
    event: e,
    value: props.value,
    name: name.value,
    checked: true,
  };
  if (group) {
    group.select(props.value, meta);
  } else {
    emit('update:modelValue', props.value);
    emit('change', props.value, meta);
  }
}
</script>

<template>
  <label :class="cls">
    <input
      class="cf-radio__input"
      type="radio"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      :id="id"
      @change="onChange"
      @focus="(event) => emit('focus', event)"
      @blur="(event) => emit('blur', event)"
    />
    <span class="cf-radio__dot" aria-hidden="true" />
    <span v-if="$slots.default" class="cf-radio__label"><slot /></span>
  </label>
</template>
