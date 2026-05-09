<script setup lang="ts">
import { computed } from 'vue';
import { colorSwatchClass, type ColorSwatchProps } from './variants';

const props = withDefaults(defineProps<ColorSwatchProps>(), {
  size: 'md',
  shape: 'square',
  selected: false,
  disabled: false,
  add: false,
});

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void;
}>();

const cls = computed(() => colorSwatchClass(props));
const style = computed(() =>
  props.color && !props.add ? { background: props.color } : undefined,
);
const ariaLabel = computed(() => props.label ?? props.color ?? (props.add ? '添加颜色' : '颜色'));
</script>

<template>
  <button
    type="button"
    :class="cls"
    :style="style"
    :aria-label="ariaLabel"
    :aria-pressed="selected || undefined"
    :disabled="disabled"
    @click="(e) => !disabled && emit('click', e)"
  >
    <svg
      v-if="add"
      class="cf-swatch__plus"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>
