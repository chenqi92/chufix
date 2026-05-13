<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  SlopeHoverPayload,
  SlopeItem,
  SlopeProps,
} from './variants';

const props = withDefaults(defineProps<SlopeProps>(), {
  beforeLabel: '之前',
  afterLabel: '之后',
  height: 320,
  colorByDirection: true,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'hover', payload: SlopeHoverPayload | null): void;
  (e: 'select', payload: SlopeHoverPayload): void;
}>();

const PAD_T = 36;
const PAD_B = 24;
const innerW = ref(420);

function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(280, el.clientWidth);
}

const all = computed(() => props.items.flatMap((i) => [i.before, i.after]));
const min = computed(() => Math.min(...all.value));
const max = computed(() => Math.max(...all.value));

function y(v: number): number {
  const range = props.height - PAD_T - PAD_B;
  const span = max.value - min.value || 1;
  return PAD_T + range - ((v - min.value) / span) * range;
}

const xL = computed(() => innerW.value * 0.32);
const xR = computed(() => innerW.value * 0.68);

function colorFor(item: SlopeItem): string {
  if (item.color) return item.color;
  if (!props.colorByDirection) return 'var(--accent-1)';
  if (item.after > item.before) return 'var(--status-success)';
  if (item.after < item.before) return 'var(--status-error)';
  return 'var(--fg-3)';
}

const hovered = ref<number | null>(null);

function fmt(v: number) {
  return props.format ? props.format(v) : v.toLocaleString();
}

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
function payload(i: number): SlopeHoverPayload {
  const item = props.items[i];
  return { index: i, item, delta: item.after - item.before };
}

/* Stagger labels at the same value to avoid overlap. We don't fully resolve
 * collision; we just nudge by per-item row offsets when the same y appears. */
function rowOffsets(side: 'before' | 'after'): number[] {
  const yMap = new Map<number, number>();
  const offsets: number[] = [];
  for (const it of props.items) {
    const v = side === 'before' ? it.before : it.after;
    const yv = Math.round(y(v));
    const c = yMap.get(yv) ?? 0;
    offsets.push(c * 14);
    yMap.set(yv, c + 1);
  }
  return offsets;
}

const offBefore = computed(() => rowOffsets('before'));
const offAfter = computed(() => rowOffsets('after'));
</script>

<template>
  <figure :class="['cf-slope', `cf-slope--${size}`]">
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? `${beforeLabel} 与 ${afterLabel} 对比`"
      role="img"
    >
      <!-- column headers -->
      <text :x="xL" :y="20" class="cf-slope__col-head">{{ beforeLabel }}</text>
      <text :x="xR" :y="20" class="cf-slope__col-head">{{ afterLabel }}</text>

      <!-- guide rails -->
      <line :x1="xL" :x2="xL" :y1="PAD_T" :y2="height - PAD_B" class="cf-slope__rail" />
      <line :x1="xR" :x2="xR" :y1="PAD_T" :y2="height - PAD_B" class="cf-slope__rail" />

      <!-- lines + labels per item -->
      <g
        v-for="(it, i) in items"
        :key="i"
        class="cf-slope__series"
        :class="{ 'is-hovered': hovered === i, 'is-dimmed': hovered !== null && hovered !== i }"
        @mouseenter="onEnter(i)"
        @mouseleave="onLeave"
        @click="onClick(i)"
        tabindex="0"
        :aria-label="`${it.label}: ${fmt(it.before)} → ${fmt(it.after)}`"
      >
        <line
          :x1="xL"
          :x2="xR"
          :y1="y(it.before)"
          :y2="y(it.after)"
          :stroke="colorFor(it)"
          stroke-width="2"
          class="cf-slope__line"
        />
        <circle :cx="xL" :cy="y(it.before)" r="4" :fill="colorFor(it)" />
        <circle :cx="xR" :cy="y(it.after)" r="4" :fill="colorFor(it)" />
        <text
          :x="xL - 8"
          :y="y(it.before) + offBefore[i] + 4"
          class="cf-slope__endpoint cf-slope__endpoint--left"
        >{{ it.label }} {{ fmt(it.before) }}</text>
        <text
          :x="xR + 8"
          :y="y(it.after) + offAfter[i] + 4"
          class="cf-slope__endpoint cf-slope__endpoint--right"
        >{{ fmt(it.after) }} {{ it.label }}</text>
      </g>
    </svg>
    <figcaption v-if="hovered !== null" class="cf-slope__tip">
      <span class="cf-slope__tip-label">{{ items[hovered].label }}</span>
      <span class="cf-slope__tip-row">{{ fmt(items[hovered].before) }} → {{ fmt(items[hovered].after) }}</span>
      <span
        class="cf-slope__tip-delta"
        :class="{
          'is-up': items[hovered].after > items[hovered].before,
          'is-down': items[hovered].after < items[hovered].before,
        }"
      >
        {{ items[hovered].after - items[hovered].before > 0 ? '+' : '' }}{{ fmt(items[hovered].after - items[hovered].before) }}
      </span>
    </figcaption>
  </figure>
</template>
