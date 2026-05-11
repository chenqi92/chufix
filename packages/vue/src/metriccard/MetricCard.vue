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

const trendData = computed(() => {
  if (Array.isArray(props.trend)) return props.trend;
  if (props.trend === 'up') return [18, 22, 21, 29, 34, 36, 42];
  if (props.trend === 'down') return [42, 39, 34, 31, 26, 22, 18];
  if (props.trend === 'flat') return [28, 30, 29, 31, 30, 32, 31];
  return [];
});

const unitText = computed(() => props.suffix ?? props.unit);
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
      <span v-if="prefix" class="cf-metric__prefix">{{ prefix }}</span>
      <span class="cf-metric__num">{{ value }}</span>
      <span v-if="unitText" class="cf-metric__unit">{{ unitText }}</span>
    </div>
    <p v-if="hint" class="cf-metric__hint">{{ hint }}</p>
    <Sparkline
      v-if="trendData.length"
      :data="trendData"
      :width="120"
      :height="32"
      filled
      smooth
      class="cf-metric__trend"
    />
  </article>
</template>
