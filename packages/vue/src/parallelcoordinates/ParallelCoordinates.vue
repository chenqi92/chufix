<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  ParallelHoverPayload,
  ParallelItem,
  ParallelProps,
} from './variants';

const props = withDefaults(defineProps<ParallelProps>(), {
  height: 280,
  ticks: 5,
  highlight: null,
  size: 'md',
  palette: () => [
    'var(--viz-1, oklch(64% 0.16 263))',
    'var(--viz-2, oklch(70% 0.13 175))',
    'var(--viz-3, oklch(74% 0.16 80))',
    'var(--viz-4, oklch(64% 0.18 30))',
    'var(--viz-5, oklch(68% 0.18 320))',
    'var(--viz-6, oklch(72% 0.14 220))',
    'var(--viz-7, oklch(70% 0.13 140))',
    'var(--viz-8, oklch(68% 0.18 0))',
  ],
});

const emit = defineEmits<{
  (e: 'hover', p: ParallelHoverPayload | null): void;
  (e: 'select', p: ParallelHoverPayload): void;
}>();

const PAD_L = 40;
const PAD_R = 40;
const PAD_T = 28;
const PAD_B = 24;

const innerW = ref(560);
function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(360, el.clientWidth);
}

const groupColorMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {};
  let idx = 0;
  for (const it of props.items) {
    const g = it.group ?? '__default';
    if (!(g in map)) {
      map[g] = props.palette[idx % props.palette.length];
      idx++;
    }
  }
  return map;
});

interface AxisInfo {
  key: string;
  label: string;
  min: number;
  max: number;
  reversed: boolean;
  x: number;
  format?: (v: number) => string;
}

const axisInfos = computed<AxisInfo[]>(() => {
  const n = props.axes.length;
  if (n === 0) return [];
  const step = (innerW.value - PAD_L - PAD_R) / Math.max(1, n - 1);
  return props.axes.map((a, i) => {
    const explicitMin = a.min;
    const explicitMax = a.max;
    let dMin = Infinity;
    let dMax = -Infinity;
    for (const it of props.items) {
      const v = it.values[a.key];
      if (typeof v === 'number') {
        if (v < dMin) dMin = v;
        if (v > dMax) dMax = v;
      }
    }
    if (!isFinite(dMin)) { dMin = 0; dMax = 1; }
    if (dMin === dMax) { dMin -= 1; dMax += 1; }
    return {
      key: a.key,
      label: a.label,
      min: explicitMin ?? dMin,
      max: explicitMax ?? dMax,
      reversed: a.reversed ?? false,
      x: PAD_L + i * step,
      format: a.format,
    };
  });
});

function y(axis: AxisInfo, v: number): number {
  const usable = props.height - PAD_T - PAD_B;
  const t = (v - axis.min) / (axis.max - axis.min || 1);
  const tt = axis.reversed ? t : 1 - t;
  return PAD_T + tt * usable;
}

function pathFor(item: ParallelItem): string {
  if (axisInfos.value.length === 0) return '';
  return axisInfos.value
    .map((a, i) => {
      const v = item.values[a.key] ?? a.min;
      return `${i === 0 ? 'M' : 'L'} ${a.x} ${y(a, v)}`;
    })
    .join(' ');
}

function colorFor(item: ParallelItem): string {
  if (item.color) return item.color;
  return groupColorMap.value[item.group ?? '__default'];
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

function tickValues(a: AxisInfo): number[] {
  const out: number[] = [];
  for (let i = 0; i < props.ticks; i++) {
    out.push(a.min + ((a.max - a.min) * i) / (props.ticks - 1));
  }
  return out;
}

function tickLabel(a: AxisInfo, v: number): string {
  if (a.format) return a.format(v);
  if (Math.abs(v) >= 1000) return v.toLocaleString();
  return v.toFixed(Math.abs(v) < 10 ? 2 : 1);
}

const groups = computed(() => Object.keys(groupColorMap.value).filter((g) => g !== '__default'));
</script>

<template>
  <figure :class="['cf-parallel', `cf-parallel--${size}`]">
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? '平行坐标图'"
      role="img"
    >
      <!-- Axis rails + labels -->
      <g class="cf-parallel__axes">
        <g v-for="a in axisInfos" :key="a.key">
          <line
            :x1="a.x"
            :x2="a.x"
            :y1="PAD_T"
            :y2="height - PAD_B"
            class="cf-parallel__axis"
          />
          <text :x="a.x" :y="PAD_T - 10" text-anchor="middle" class="cf-parallel__axis-title">{{ a.label }}</text>
          <g class="cf-parallel__ticks">
            <text
              v-for="(t, ti) in tickValues(a)"
              :key="ti"
              :x="a.x - 6"
              :y="y(a, t)"
              class="cf-parallel__tick"
              text-anchor="end"
              dominant-baseline="middle"
            >{{ tickLabel(a, t) }}</text>
          </g>
        </g>
      </g>

      <!-- Lines -->
      <g class="cf-parallel__lines">
        <path
          v-for="(it, i) in items"
          :key="i"
          :d="pathFor(it)"
          :stroke="colorFor(it)"
          :opacity="hovered === null || hovered === i ? 0.85 : 0.18"
          :stroke-width="hovered === i ? 2.4 : 1.4"
          fill="none"
          class="cf-parallel__line"
          tabindex="0"
          :aria-label="it.label"
          @mouseenter="onEnter(i)"
          @mouseleave="onLeave"
          @click="onClick(i)"
        />
      </g>
    </svg>

    <footer v-if="groups.length" class="cf-parallel__legend">
      <span v-for="g in groups" :key="g" class="cf-parallel__legend-item">
        <span class="cf-parallel__swatch" :style="{ background: groupColorMap[g] }" />
        {{ g }}
      </span>
    </footer>

    <figcaption v-if="hovered !== null" class="cf-parallel__tip">
      <span class="cf-parallel__tip-label">{{ items[hovered].label }}</span>
      <span
        v-for="a in axisInfos"
        :key="a.key"
        class="cf-parallel__tip-row"
      >{{ a.label }}: {{ tickLabel(a, items[hovered].values[a.key] ?? a.min) }}</span>
    </figcaption>
  </figure>
</template>
