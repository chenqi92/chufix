<script setup lang="ts">
import { computed, provide, reactive } from 'vue';
import {
  radioGroupClass,
  radioGroupKey,
  type RadioGroupProps,
  type RadioValue,
} from './variants';

const props = withDefaults(defineProps<RadioGroupProps>(), {
  modelValue: null,
  size: 'md',
  disabled: false,
  direction: 'row',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: RadioValue): void;
  (e: 'change', value: RadioValue): void;
}>();

const cls = computed(() => radioGroupClass({ direction: props.direction }));

const ctxValue = reactive({
  get current(): RadioValue {
    return props.modelValue;
  },
});

provide(radioGroupKey, {
  value: ctxValue,
  name: props.name,
  size: props.size,
  disabled: props.disabled,
  select(v: RadioValue) {
    emit('update:modelValue', v);
    emit('change', v);
  },
});
</script>

<template>
  <div :class="cls" role="radiogroup">
    <slot />
  </div>
</template>
