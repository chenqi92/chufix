<script setup lang="ts">
import { computed } from 'vue';
import Sparkline from '../sparkline/Sparkline.vue';
import type { MetricCardProps } from './variants';

const props = defineProps<MetricCardProps>();

const deltaText = computed(() => {
  if (props.delta == null) return '';
  if (props.deltaFn) return props.deltaFn(props.delta);
  const sign = props.delta > 0 ? '+' : '';
  return `${sign}${props.delta.toFixed(1)}%`;
});

const deltaTone = computed(() => {
  if (props.delta == null) return 'neutral';
  if (props.delta > 0) return 'positive';
  if (props.delta < 0) return 'negative';
  return 'neutral';
});
</script>

<template>
  <article
    class="cf-metric"
    role="figure"
    :aria-label="ariaLabel ?? label"
  >
    <header class="cf-metric__head">
      <span class="cf-metric__label">{{ label }}</span>
      <span
        v-if="delta != null"
        :class="['cf-metric__delta', `cf-metric__delta--${deltaTone}`]"
      >{{ deltaText }}</span>
    </header>
    <div class="cf-metric__value">
      <span class="cf-metric__num">{{ value }}</span>
      <span v-if="unit" class="cf-metric__unit">{{ unit }}</span>
    </div>
    <Sparkline
      v-if="trend && trend.length"
      :data="trend"
      :width="120"
      :height="32"
      filled
      smooth
      class="cf-metric__trend"
    />
  </article>
</template>
