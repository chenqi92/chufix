<script setup lang="ts">
import { computed, ref } from 'vue';
import { linePath } from '../_charts/scale';
import type {
  ParetoHoverPayload,
  ParetoItem,
  ParetoProps,
} from './variants';

const props = withDefaults(defineProps<ParetoProps>(), {
  height: 260,
  cutoff: 0.8,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'hover', payload: ParetoHoverPayload | null): void;
  (e: 'select', payload: ParetoHoverPayload): void;
}>();

const PAD_L = 44;
const PAD_R = 44;
const PAD_T = 16;
const PAD_B = 36;

const innerW = ref(560);
function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(280, el.clientWidth);
}

const sorted = computed<ParetoItem[]>(() =>
  [...props.items].sort((a, b) => b.value - a.value),
);

const total = computed(() => sorted.value.reduce((s, it) => s + it.value, 0));
const max = computed(() => sorted.value[0]?.value ?? 1);

const cumulative = computed<number[]>(() => {
  const out: number[] = [];
  let acc = 0;
  for (const it of sorted.value) {
    acc += it.value;
    out.push(acc);
  }
  return out;
});

function yBar(v: number): number {
  const range = props.height - PAD_T - PAD_B;
  return PAD_T + range - (v / max.value) * range;
}
function yPct(pct: number): number {
  const range = props.height - PAD_T - PAD_B;
  return PAD_T + range - pct * range;
}

const bandStep = computed(() => (innerW.value - PAD_L - PAD_R) / Math.max(1, sorted.value.length));
const barW = computed(() => bandStep.value * 0.62);

function bandCenter(i: number): number {
  return PAD_L + bandStep.value * (i + 0.5);
}

const pctPoints = computed(() =>
  cumulative.value.map((c, i) => ({
    x: bandCenter(i),
    y: yPct(total.value ? c / total.value : 0),
  })),
);

const linePathD = computed(() => linePath(pctPoints.value, false));

const cutoffY = computed(() => yPct(props.cutoff));

const hovered = ref<number | null>(null);

function onEnter(i: number) {
  hovered.value = i;
  emit('hover', payload(i));
}
function onLeave() {
  hovered.value = null;
  emit('hover', null);
}
function onClick(i: number) {
  emit('select', payload(i));
}

function payload(i: number): ParetoHoverPayload {
  return {
    index: i,
    item: sorted.value[i],
    cumulative: cumulative.value[i],
    cumulativePct: total.value ? cumulative.value[i] / total.value : 0,
  };
}

function fmt(v: number) {
  return props.formatValue ? props.formatValue(v) : v.toLocaleString();
}

const barColor = computed(() => props.barColor ?? 'var(--accent-1)');
const lineColor = computed(() => props.lineColor ?? 'var(--status-warning)');

const valueTicks = computed(() => {
  const m = max.value;
  return [0, m * 0.25, m * 0.5, m * 0.75, m];
});
const pctTicks = [0, 0.25, 0.5, 0.75, 1];
</script>

<template>
  <figure :class="['cf-pareto', `cf-pareto--${size}`]">
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? '帕累托分析图'"
      role="img"
    >
      <!-- gridlines + left ticks -->
      <g class="cf-pareto__y">
        <line
          v-for="(t, i) in valueTicks"
          :key="`g-${i}`"
          :x1="PAD_L"
          :x2="innerW - PAD_R"
          :y1="yBar(t)"
          :y2="yBar(t)"
          class="cf-pareto__grid"
        />
        <text
          v-for="(t, i) in valueTicks"
          :key="`yl-${i}`"
          :x="PAD_L - 6"
          :y="yBar(t)"
          class="cf-pareto__axis-label cf-pareto__axis-label--left"
        >{{ fmt(t) }}</text>
        <text
          v-for="(t, i) in pctTicks"
          :key="`yr-${i}`"
          :x="innerW - PAD_R + 6"
          :y="yPct(t)"
          class="cf-pareto__axis-label cf-pareto__axis-label--right"
        >{{ Math.round(t * 100) }}%</text>
      </g>

      <!-- cutoff reference line -->
      <line
        :x1="PAD_L"
        :x2="innerW - PAD_R"
        :y1="cutoffY"
        :y2="cutoffY"
        class="cf-pareto__cutoff"
      />
      <text
        :x="innerW - PAD_R - 4"
        :y="cutoffY - 4"
        class="cf-pareto__cutoff-label"
      >{{ Math.round(cutoff * 100) }}%</text>

      <!-- bars -->
      <g class="cf-pareto__bars">
        <rect
          v-for="(it, i) in sorted"
          :key="i"
          :x="bandCenter(i) - barW / 2"
          :y="yBar(it.value)"
          :width="barW"
          :height="Math.max(0, height - PAD_B - yBar(it.value))"
          :fill="it.color ?? barColor"
          :opacity="hovered === null || hovered === i ? 1 : 0.4"
          class="cf-pareto__bar"
          tabindex="0"
          :aria-label="`${it.label}: ${fmt(it.value)}`"
          @mouseenter="onEnter(i)"
          @mouseleave="onLeave"
          @click="onClick(i)"
        />
      </g>

      <!-- cumulative line -->
      <path :d="linePathD" :stroke="lineColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="cf-pareto__line" />
      <g class="cf-pareto__points">
        <circle
          v-for="(p, i) in pctPoints"
          :key="`p-${i}`"
          :cx="p.x"
          :cy="p.y"
          r="3.5"
          :fill="hovered === i ? lineColor : 'var(--bg-1)'"
          :stroke="lineColor"
          stroke-width="1.6"
        />
      </g>

      <!-- x labels -->
      <g class="cf-pareto__x">
        <text
          v-for="(it, i) in sorted"
          :key="`xl-${i}`"
          :x="bandCenter(i)"
          :y="height - PAD_B + 16"
          class="cf-pareto__axis-label cf-pareto__axis-label--x"
        >{{ it.label }}</text>
      </g>
    </svg>
    <figcaption v-if="hovered !== null" class="cf-pareto__tip">
      <span class="cf-pareto__tip-name">{{ sorted[hovered].label }}</span>
      <span class="cf-pareto__tip-row">{{ fmt(sorted[hovered].value) }}</span>
      <span class="cf-pareto__tip-row cf-pareto__tip-row--muted">累计 {{ Math.round((cumulative[hovered] / Math.max(1, total)) * 100) }}%</span>
    </figcaption>
  </figure>
</template>
