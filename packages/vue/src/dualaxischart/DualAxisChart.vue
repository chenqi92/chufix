<script setup lang="ts">
import { computed, ref } from 'vue';
import { domainOf, linePath, linearScale, ticks } from '../_charts/scale';
import type {
  DualAxisHoverPayload,
  DualAxisProps,
} from './variants';

const props = withDefaults(defineProps<DualAxisProps>(), {
  height: 240,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'hover', payload: DualAxisHoverPayload | null): void;
  (e: 'select', payload: DualAxisHoverPayload): void;
}>();

const PAD_L = 44;
const PAD_R = 44;
const PAD_T = 16;
const PAD_B = 28;

const innerW = ref(560);
function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(280, el.clientWidth);
}

const barDomain = computed(() => {
  const d = domainOf(props.bar.data);
  return { min: Math.min(0, d.min), max: d.max };
});
const lineDomain = computed(() => {
  const d = domainOf(props.line.data);
  return { min: Math.min(0, d.min), max: d.max };
});

const barScale = computed(() =>
  linearScale(barDomain.value, { start: props.height - PAD_B, end: PAD_T }),
);
const lineScale = computed(() =>
  linearScale(lineDomain.value, { start: props.height - PAD_B, end: PAD_T }),
);

const bandStep = computed(() => (innerW.value - PAD_L - PAD_R) / Math.max(1, props.categories.length));
const barW = computed(() => bandStep.value * 0.6);

function bandCenter(i: number): number {
  return PAD_L + bandStep.value * (i + 0.5);
}

const linePts = computed(() =>
  props.line.data.map((v, i) => ({ x: bandCenter(i), y: lineScale.value(v) })),
);

const linePathD = computed(() => linePath(linePts.value, props.line.smooth));

const barTicks = computed(() => ticks(barDomain.value, 5));
const lineTicks = computed(() => ticks(lineDomain.value, 5));

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

function payload(i: number): DualAxisHoverPayload {
  return {
    index: i,
    category: props.categories[i],
    barValue: props.bar.data[i],
    lineValue: props.line.data[i],
  };
}

function fmtBar(v: number) {
  return props.formatBar ? props.formatBar(v) : v.toLocaleString();
}
function fmtLine(v: number) {
  return props.formatLine ? props.formatLine(v) : v.toLocaleString();
}

const barColor = computed(() => props.bar.color ?? 'var(--accent-1)');
const lineColor = computed(() => props.line.color ?? 'var(--status-warning)');
</script>

<template>
  <figure :class="['cf-dual', `cf-dual--${size}`]">
    <header v-if="bar.label || line.label" class="cf-dual__legend">
      <span class="cf-dual__legend-item">
        <span class="cf-dual__swatch cf-dual__swatch--bar" :style="{ background: barColor }" />
        {{ bar.label }}
      </span>
      <span class="cf-dual__legend-item">
        <span class="cf-dual__swatch cf-dual__swatch--line" :style="{ background: lineColor }" />
        {{ line.label }}
      </span>
    </header>
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? `${bar.label} 与 ${line.label} 组合图`"
      role="img"
    >
      <!-- Y axes -->
      <g class="cf-dual__y">
        <line
          v-for="(t, i) in barTicks"
          :key="`gx-${i}`"
          :x1="PAD_L"
          :x2="innerW - PAD_R"
          :y1="barScale(t)"
          :y2="barScale(t)"
          class="cf-dual__grid"
        />
        <text
          v-for="(t, i) in barTicks"
          :key="`yl-${i}`"
          :x="PAD_L - 6"
          :y="barScale(t)"
          class="cf-dual__axis-label cf-dual__axis-label--left"
        >{{ fmtBar(t) }}</text>
        <text
          v-for="(t, i) in lineTicks"
          :key="`yr-${i}`"
          :x="innerW - PAD_R + 6"
          :y="lineScale(t)"
          class="cf-dual__axis-label cf-dual__axis-label--right"
        >{{ fmtLine(t) }}</text>
      </g>

      <!-- bars -->
      <g class="cf-dual__bars">
        <rect
          v-for="(v, i) in bar.data"
          :key="i"
          :x="bandCenter(i) - barW / 2"
          :y="Math.min(barScale(v), barScale(0))"
          :width="barW"
          :height="Math.abs(barScale(v) - barScale(0))"
          :fill="barColor"
          :opacity="hovered === null || hovered === i ? 1 : 0.45"
          class="cf-dual__bar"
          @mouseenter="onEnter(i)"
          @mouseleave="onLeave"
          @click="onClick(i)"
          tabindex="0"
          :aria-label="`${categories[i]}: ${fmtBar(v)}`"
        />
      </g>

      <!-- line -->
      <path :d="linePathD" :stroke="lineColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="cf-dual__line" />
      <g class="cf-dual__points">
        <circle
          v-for="(p, i) in linePts"
          :key="`p-${i}`"
          :cx="p.x"
          :cy="p.y"
          r="3.5"
          :fill="hovered === i ? lineColor : 'var(--bg-1)'"
          :stroke="lineColor"
          stroke-width="1.6"
          class="cf-dual__dot"
        />
      </g>

      <!-- x labels -->
      <g class="cf-dual__x">
        <text
          v-for="(c, i) in categories"
          :key="`cx-${i}`"
          :x="bandCenter(i)"
          :y="height - PAD_B + 16"
          class="cf-dual__axis-label cf-dual__axis-label--x"
        >{{ c }}</text>
      </g>

      <!-- hover guide -->
      <line
        v-if="hovered !== null"
        :x1="bandCenter(hovered)"
        :x2="bandCenter(hovered)"
        :y1="PAD_T"
        :y2="height - PAD_B"
        class="cf-dual__hover-line"
      />
    </svg>
    <figcaption v-if="hovered !== null" class="cf-dual__tip">
      <span class="cf-dual__tip-cat">{{ categories[hovered] }}</span>
      <span class="cf-dual__tip-row"><span class="cf-dual__swatch" :style="{ background: barColor }" />{{ bar.label }}: {{ fmtBar(bar.data[hovered]) }}</span>
      <span class="cf-dual__tip-row"><span class="cf-dual__swatch" :style="{ background: lineColor }" />{{ line.label }}: {{ fmtLine(line.data[hovered]) }}</span>
    </figcaption>
  </figure>
</template>
