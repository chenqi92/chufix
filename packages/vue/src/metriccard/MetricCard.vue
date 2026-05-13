<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Sparkline from '../sparkline/Sparkline.vue';
import type {
  MetricCardExpandPayload,
  MetricCardProps,
  MetricSeriesItem,
} from './variants';

const props = withDefaults(defineProps<MetricCardProps>(), {
  expandable: true,
  defaultExpanded: false,
});

const emit = defineEmits<{
  (e: 'update:expanded', value: boolean): void;
  (e: 'expand', payload: MetricCardExpandPayload): void;
}>();

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

/* Controlled vs. uncontrolled expansion. */
const internal = ref(props.defaultExpanded);
watch(
  () => props.expanded,
  (v) => {
    if (v != null) internal.value = v;
  },
  { immediate: true },
);
const isExpanded = computed(() => (props.expanded != null ? props.expanded : internal.value));

const hasSeries = computed(() => !!(props.series && props.series.length));
const canExpand = computed(() => props.expandable && hasSeries.value);

function toggle() {
  if (!canExpand.value) return;
  const next = !isExpanded.value;
  internal.value = next;
  emit('update:expanded', next);
  emit('expand', { expanded: next });
}

function seriesDeltaText(it: MetricSeriesItem): string {
  if (it.delta == null) return '';
  const sign = it.delta > 0 ? '+' : '';
  return `${sign}${it.delta.toFixed(1)}%`;
}
function seriesDeltaTone(it: MetricSeriesItem): string {
  if (it.delta == null) return 'neutral';
  if (it.delta > 0) return 'positive';
  if (it.delta < 0) return 'negative';
  return 'neutral';
}
</script>

<template>
  <article
    :class="['cf-metric', canExpand && 'cf-metric--expandable', isExpanded && 'is-expanded']"
    role="figure"
    :aria-label="ariaLabel ?? label"
    :aria-expanded="canExpand ? isExpanded : undefined"
  >
    <header class="cf-metric__head">
      <span class="cf-metric__label">{{ label }}</span>
      <span
        v-if="delta != null"
        :class="['cf-metric__delta', `cf-metric__delta--${deltaTone}`]"
      >{{ deltaText }}</span>
      <button
        v-if="canExpand"
        type="button"
        class="cf-metric__toggle"
        :aria-label="isExpanded ? '收起明细' : '展开明细'"
        :aria-expanded="isExpanded"
        @click="toggle"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
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

    <ul v-if="canExpand && isExpanded" class="cf-metric__series" role="list">
      <li
        v-for="(it, i) in props.series"
        :key="i"
        class="cf-metric__series-item"
      >
        <span class="cf-metric__series-swatch" :style="it.color ? { background: it.color } : undefined" />
        <span class="cf-metric__series-label">{{ it.label }}</span>
        <span class="cf-metric__series-value">
          <span v-if="it.prefix" class="cf-metric__series-prefix">{{ it.prefix }}</span>{{ it.value }}<span v-if="it.suffix" class="cf-metric__series-suffix">{{ it.suffix }}</span>
        </span>
        <span
          v-if="it.delta != null"
          :class="['cf-metric__series-delta', `cf-metric__delta--${seriesDeltaTone(it)}`]"
        >{{ seriesDeltaText(it) }}</span>
        <Sparkline
          v-if="it.trend && it.trend.length"
          :data="it.trend"
          :width="64"
          :height="18"
          smooth
          class="cf-metric__series-trend"
        />
      </li>
    </ul>
  </article>
</template>
