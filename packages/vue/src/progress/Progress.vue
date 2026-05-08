<script setup lang="ts">
import { computed } from 'vue';
import {
  type ProgressProps,
  progressClass,
  clamp,
} from './variants';

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  variant: 'line',
  tone: 'primary',
  size: 'md',
  indeterminate: false,
  showLabel: false,
});

const v = computed(() => clamp(props.value!));

const rootClass = computed(() =>
  progressClass({
    variant: props.variant!,
    tone: props.tone!,
    size: props.size!,
    indeterminate: props.indeterminate!,
  })
);

/* circle geometry */
const circleSize = computed(() =>
  props.size === 'sm' ? 48 : props.size === 'lg' ? 96 : 64
);
const stroke = computed(
  () => props.strokeWidth ?? (props.size === 'sm' ? 4 : props.size === 'lg' ? 8 : 6)
);
const r = computed(() => (circleSize.value - stroke.value) / 2);
const c = computed(() => 2 * Math.PI * r.value);
const dashOffset = computed(() => c.value * (1 - v.value / 100));
</script>

<template>
  <!-- LINE -->
  <div
    v-if="variant === 'line'"
    :class="rootClass"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : v"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="cf-progress__track">
      <div
        class="cf-progress__fill"
        :style="indeterminate ? undefined : { width: v + '%' }"
      ></div>
    </div>
    <span v-if="showLabel" class="cf-progress__label">{{ v }}%</span>
  </div>

  <!-- CIRCLE -->
  <div
    v-else
    :class="rootClass"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : v"
    aria-valuemin="0"
    aria-valuemax="100"
    :style="{ width: circleSize + 'px', height: circleSize + 'px' }"
  >
    <svg :width="circleSize" :height="circleSize" :viewBox="`0 0 ${circleSize} ${circleSize}`">
      <circle
        class="cf-progress__circle-track"
        :cx="circleSize / 2"
        :cy="circleSize / 2"
        :r="r"
        fill="none"
        :stroke-width="stroke"
      />
      <circle
        class="cf-progress__circle-fill"
        :cx="circleSize / 2"
        :cy="circleSize / 2"
        :r="r"
        fill="none"
        :stroke-width="stroke"
        :stroke-dasharray="c"
        :stroke-dashoffset="indeterminate ? c * 0.75 : dashOffset"
        stroke-linecap="round"
        :transform="`rotate(-90 ${circleSize / 2} ${circleSize / 2})`"
      />
    </svg>
    <span v-if="showLabel" class="cf-progress__circle-label">{{ v }}%</span>
  </div>
</template>
