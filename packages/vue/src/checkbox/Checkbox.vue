<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { checkboxClass, type CheckboxChangeMeta, type CheckboxProps } from './variants';

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  size: 'md',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean, meta: CheckboxChangeMeta): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const cls = computed(() =>
  checkboxClass({
    size: props.size,
    disabled: props.disabled,
    indeterminate: props.indeterminate,
  }),
);

function syncIndeterminate() {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate;
}

onMounted(syncIndeterminate);
watch(() => props.indeterminate, syncIndeterminate);

function onChange(e: Event) {
  if (props.disabled) return;
  const v = (e.target as HTMLInputElement).checked;
  emit('update:modelValue', v);
  emit('change', v, {
    event: e,
    checked: v,
    indeterminate: props.indeterminate,
    value: props.value,
    name: props.name,
  });
}
</script>

<template>
  <label :class="cls">
    <input
      ref="inputRef"
      class="cf-checkbox__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :name="name"
      :id="id"
      :value="value"
      :aria-checked="indeterminate ? 'mixed' : modelValue"
      @change="onChange"
      @focus="(event) => emit('focus', event)"
      @blur="(event) => emit('blur', event)"
    />
    <span class="cf-checkbox__box" aria-hidden="true">
      <svg
        v-if="!indeterminate"
        class="cf-checkbox__check"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8.5l3.2 3.2L13 5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span v-else class="cf-checkbox__dash" />
    </span>
    <span v-if="$slots.default" class="cf-checkbox__label"><slot /></span>
  </label>
</template>
