<script setup lang="ts">
import { computed, ref } from 'vue';
import { ratingClass, type RatingProps } from './variants';

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  count: 5,
  allowHalf: false,
  readonly: false,
  disabled: false,
  size: 'md',
  showValue: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
}>();

const hover = ref<number | null>(null);

const display = computed(() => hover.value ?? props.modelValue);

const cls = computed(() =>
  ratingClass({
    size: props.size,
    readonly: props.readonly,
    disabled: props.disabled,
  }),
);

function pickValue(i: number, e: MouseEvent): number {
  if (!props.allowHalf) return i + 1;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const isLeft = (e.clientX - rect.left) / rect.width <= 0.5;
  return isLeft ? i + 0.5 : i + 1;
}

function onMove(i: number, e: MouseEvent) {
  if (props.readonly || props.disabled) return;
  hover.value = pickValue(i, e);
}

function onLeave() {
  hover.value = null;
}

function onClick(i: number, e: MouseEvent) {
  if (props.readonly || props.disabled) return;
  const v = pickValue(i, e);
  emit('update:modelValue', v);
  emit('change', v);
}

function fillState(i: number) {
  const v = display.value;
  if (v >= i + 1) return 'full';
  if (v >= i + 0.5) return 'half';
  return 'empty';
}
</script>

<template>
  <div :class="cls" :aria-label="`${modelValue} / ${count}`">
    <button
      v-for="i in count"
      :key="i - 1"
      type="button"
      class="cf-rating__star"
      :class="`cf-rating__star--${fillState(i - 1)}`"
      :disabled="disabled"
      :aria-pressed="fillState(i - 1) !== 'empty'"
      @mousemove="onMove(i - 1, $event)"
      @mouseleave="onLeave"
      @click="onClick(i - 1, $event)"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5l2.7 6.5 7 .6-5.3 4.6 1.6 6.8L12 17.7l-6 3.3 1.6-6.8-5.3-4.6 7-.6L12 2.5z"
        />
      </svg>
    </button>
    <span v-if="showValue" class="cf-rating__value">
      {{ modelValue }} <span class="cf-rating__total">/ {{ count }}</span>
    </span>
  </div>
</template>
