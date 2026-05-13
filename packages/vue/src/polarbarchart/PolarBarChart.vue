<script setup lang="ts">
import { computed, ref } from 'vue';
import { arcPath, polar } from '../_charts/scale';
import type {
  PolarBarHoverPayload,
  PolarBarItem,
  PolarBarProps,
} from './variants';

const props = withDefaults(defineProps<PolarBarProps>(), {
  size: 280,
  innerRatio: 0.35,
  sweep: 360,
  startAngle: 0,
  showLabels: true,
  variant: 'md',
});

const emit = defineEmits<{
  (e: 'hover', payload: PolarBarHoverPayload | null): void;
  (e: 'select', payload: PolarBarHoverPayload): void;
}>();

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const rOuter = computed(() => props.size / 2 - 24);
const rInner = computed(() => rOuter.value * props.innerRatio);

const max = computed(() => Math.max(1, ...props.items.map((i) => i.value)));
const slice = computed(() => props.sweep / Math.max(1, props.items.length));
const gap = computed(() => Math.min(2.2, slice.value * 0.12));

function arc(i: number, v: number): string {
  const start = props.startAngle + slice.value * i + gap.value / 2;
  const end = props.startAngle + slice.value * (i + 1) - gap.value / 2;
  const ratio = Math.max(0, Math.min(1, v / max.value));
  const r = rInner.value + (rOuter.value - rInner.value) * ratio;
  return arcPath(cx.value, cy.value, r, rInner.value, start, end);
}

function labelPos(i: number) {
  const mid = props.startAngle + slice.value * (i + 0.5);
  return polar(cx.value, cy.value, rOuter.value + 12, mid);
}

const hovered = ref<number | null>(null);
function onEnter(i: number) {
  hovered.value = i;
  emit('hover', { index: i, item: props.items[i] });
}
function onLeave() {
  hovered.value = null;
  emit('hover', null);
}
function onClick(i: number) {
  emit('select', { index: i, item: props.items[i] });
}

function fmt(v: number) {
  return props.format ? props.format(v) : v.toLocaleString();
}
function colorFor(it: PolarBarItem) {
  return it.color ?? props.barColor ?? 'var(--accent-1)';
}
</script>

<template>
  <figure :class="['cf-polar-bar', `cf-polar-bar--${variant}`]">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
      :aria-label="ariaLabel ?? '极坐标柱状图'"
      role="img"
    >
      <!-- background rings as scale guide -->
      <g class="cf-polar-bar__grid">
        <circle :cx="cx" :cy="cy" :r="rInner" class="cf-polar-bar__ring" />
        <circle :cx="cx" :cy="cy" :r="rInner + (rOuter - rInner) * 0.5" class="cf-polar-bar__ring" />
        <circle :cx="cx" :cy="cy" :r="rOuter" class="cf-polar-bar__ring" />
      </g>

      <!-- bars -->
      <g class="cf-polar-bar__bars">
        <path
          v-for="(it, i) in items"
          :key="i"
          :d="arc(i, it.value)"
          :fill="colorFor(it)"
          :opacity="hovered === null || hovered === i ? 1 : 0.4"
          class="cf-polar-bar__bar"
          tabindex="0"
          :aria-label="`${it.label}: ${fmt(it.value)}`"
          @mouseenter="onEnter(i)"
          @mouseleave="onLeave"
          @click="onClick(i)"
        />
      </g>

      <!-- labels -->
      <g v-if="showLabels" class="cf-polar-bar__labels">
        <text
          v-for="(it, i) in items"
          :key="`l-${i}`"
          :x="labelPos(i).x"
          :y="labelPos(i).y"
          class="cf-polar-bar__label"
          text-anchor="middle"
          dominant-baseline="middle"
        >{{ it.label }}</text>
      </g>
    </svg>
    <figcaption v-if="hovered !== null" class="cf-polar-bar__tip">
      <span class="cf-polar-bar__swatch" :style="{ background: colorFor(items[hovered]) }" />
      <span class="cf-polar-bar__tip-label">{{ items[hovered].label }}</span>
      <span class="cf-polar-bar__tip-value">{{ fmt(items[hovered].value) }}</span>
    </figcaption>
  </figure>
</template>
