<script setup lang="ts">
import { computed } from 'vue';
import {
  resolveStatus,
  stepperClass,
  type StepItem,
  type StepperProps,
  type StepStatus,
} from './variants';

const props = withDefaults(defineProps<StepperProps>(), {
  current: 0,
  variant: 'numbered',
  orientation: 'horizontal',
  size: 'md',
  clickable: false,
});

const emit = defineEmits<{ (e: 'change', index: number, item: StepItem): void }>();

const cls = computed(() =>
  stepperClass({
    variant: props.variant,
    orientation: props.orientation,
    size: props.size,
  }),
);

function statusOf(index: number): StepStatus {
  return resolveStatus(index, props.current, props.items[index]?.status);
}

function onClick(index: number, item: StepItem) {
  if (!props.clickable || item.disabled) return;
  emit('change', index, item);
}
</script>

<template>
  <ol :class="cls">
    <li
      v-for="(item, i) in items"
      :key="item.key ?? i"
      class="cf-stepper__item"
      :class="[
        `is-${statusOf(i)}`,
        item.disabled && 'is-disabled',
        clickable && !item.disabled && 'is-clickable',
      ]"
    >
      <button
        type="button"
        class="cf-stepper__node"
        :disabled="!clickable || item.disabled"
        :aria-current="statusOf(i) === 'current' ? 'step' : undefined"
        @click="onClick(i, item)"
      >
        <span class="cf-stepper__indicator">
          <template v-if="statusOf(i) === 'done'">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          <template v-else-if="statusOf(i) === 'error'">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </template>
          <template v-else-if="variant === 'dots'">
            <span class="cf-stepper__dot" />
          </template>
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span class="cf-stepper__body">
          <span class="cf-stepper__title">{{ item.title }}</span>
          <span v-if="item.description" class="cf-stepper__description">
            {{ item.description }}
          </span>
        </span>
      </button>
      <span
        v-if="i < items.length - 1"
        class="cf-stepper__connector"
        :class="i < current && 'is-active'"
      />
    </li>
  </ol>
</template>
