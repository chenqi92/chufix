<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  StreamGraphHoverPayload,
  StreamGraphProps,
  StreamSeries,
} from './variants';

const props = withDefaults(defineProps<StreamGraphProps>(), {
  height: 240,
  baseline: 'wiggle',
  smooth: true,
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
  (e: 'hover', p: StreamGraphHoverPayload | null): void;
  (e: 'select', p: StreamGraphHoverPayload): void;
}>();

const PAD_L = 12;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 24;

const innerW = ref(560);
function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(280, el.clientWidth);
}

const totals = computed<number[]>(() => {
  const n = props.categories.length;
  const out = new Array(n).fill(0);
  for (const s of props.series) {
    for (let i = 0; i < n; i++) out[i] += s.data[i] ?? 0;
  }
  return out;
});

const maxTotal = computed(() => Math.max(1, ...totals.value));

interface Lane {
  series: StreamSeries;
  color: string;
  /** Top y per category. */
  top: number[];
  /** Bottom y per category. */
  bottom: number[];
}

const lanes = computed<Lane[]>(() => {
  const n = props.categories.length;
  const usableH = props.height - PAD_T - PAD_B;
  const centerY = PAD_T + usableH / 2;

  /* offset[i] = where this category's stack starts on the y axis */
  const offsets = totals.value.map((t) => {
    if (props.baseline === 'wiggle') {
      const scaled = (t / maxTotal.value) * usableH;
      return centerY - scaled / 2;
    }
    return PAD_T + usableH; /* zero baseline at the bottom */
  });

  const out: Lane[] = props.series.map((s, idx) => ({
    series: s,
    color: s.color ?? props.palette[idx % props.palette.length],
    top: new Array(n),
    bottom: new Array(n),
  }));

  for (let i = 0; i < n; i++) {
    let y = offsets[i];
    for (let k = 0; k < out.length; k++) {
      const v = props.series[k].data[i] ?? 0;
      const h = (v / maxTotal.value) * usableH;
      if (props.baseline === 'wiggle') {
        out[k].top[i] = y;
        out[k].bottom[i] = y + h;
        y += h;
      } else {
        /* zero: stack grows upward from offset */
        out[k].bottom[i] = y;
        out[k].top[i] = y - h;
        y -= h;
      }
    }
  }
  return out;
});

const bandStep = computed(() => (innerW.value - PAD_L - PAD_R) / Math.max(1, props.categories.length - 1));

function x(i: number) {
  return PAD_L + bandStep.value * i;
}

/* Build a closed path for a lane (top edge forward, bottom edge reversed). */
function lanePath(lane: Lane): string {
  const n = props.categories.length;
  if (!n) return '';
  if (!props.smooth || n < 3) {
    let d = `M ${x(0)} ${lane.top[0]}`;
    for (let i = 1; i < n; i++) d += ` L ${x(i)} ${lane.top[i]}`;
    for (let i = n - 1; i >= 0; i--) d += ` L ${x(i)} ${lane.bottom[i]}`;
    return d + ' Z';
  }
  /* Catmull-Rom-ish smoothing for top then bottom (reversed). */
  function smoothPath(ys: number[]): string {
    let d = `M ${x(0)} ${ys[0]}`;
    for (let i = 0; i < ys.length - 1; i++) {
      const xc = (x(i) + x(i + 1)) / 2;
      d += ` C ${xc} ${ys[i]} ${xc} ${ys[i + 1]} ${x(i + 1)} ${ys[i + 1]}`;
    }
    return d;
  }
  const top = smoothPath(lane.top);
  const bottomReversed = (() => {
    const ys = [...lane.bottom].reverse();
    const xs = props.categories.map((_, i) => x(n - 1 - i));
    let d = ` L ${xs[0]} ${ys[0]}`;
    for (let i = 0; i < ys.length - 1; i++) {
      const xc = (xs[i] + xs[i + 1]) / 2;
      d += ` C ${xc} ${ys[i]} ${xc} ${ys[i + 1]} ${xs[i + 1]} ${ys[i + 1]}`;
    }
    return d;
  })();
  return top + bottomReversed + ' Z';
}

const hovered = ref<number | null>(null);

function onCatEnter(i: number) {
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

function payload(i: number): StreamGraphHoverPayload {
  const values: Record<string, number> = {};
  for (const s of props.series) values[s.label] = s.data[i] ?? 0;
  return { index: i, category: props.categories[i], values };
}

function fmt(v: number) {
  return props.format ? props.format(v) : v.toLocaleString();
}
</script>

<template>
  <figure :class="['cf-streamgraph', `cf-streamgraph--${size}`]">
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? '河流图'"
      role="img"
    >
      <g class="cf-streamgraph__lanes">
        <path
          v-for="(lane, idx) in lanes"
          :key="idx"
          :d="lanePath(lane)"
          :fill="lane.color"
          :opacity="0.85"
          class="cf-streamgraph__lane"
        >
          <title>{{ lane.series.label }}</title>
        </path>
      </g>

      <!-- Invisible hit zones per category column for hover -->
      <g class="cf-streamgraph__hits">
        <rect
          v-for="(c, i) in categories"
          :key="i"
          :x="x(i) - bandStep / 2"
          :y="PAD_T"
          :width="Math.max(bandStep, 1)"
          :height="height - PAD_T - PAD_B"
          fill="transparent"
          tabindex="0"
          :aria-label="`${c}`"
          @mouseenter="onCatEnter(i)"
          @mouseleave="onLeave"
          @click="onClick(i)"
        />
      </g>

      <!-- Hover vertical guide -->
      <line
        v-if="hovered !== null"
        :x1="x(hovered)"
        :x2="x(hovered)"
        :y1="PAD_T"
        :y2="height - PAD_B"
        class="cf-streamgraph__hover-line"
      />

      <!-- X axis labels -->
      <g class="cf-streamgraph__x">
        <text
          v-for="(c, i) in categories"
          :key="`xl-${i}`"
          :x="x(i)"
          :y="height - PAD_B + 16"
          class="cf-streamgraph__axis-label"
          text-anchor="middle"
        >{{ c }}</text>
      </g>
    </svg>

    <figcaption v-if="hovered !== null" class="cf-streamgraph__tip">
      <span class="cf-streamgraph__tip-cat">{{ categories[hovered] }}</span>
      <span
        v-for="(s, idx) in series"
        :key="idx"
        class="cf-streamgraph__tip-row"
      >
        <span class="cf-streamgraph__swatch" :style="{ background: lanes[idx].color }" />
        {{ s.label }}: {{ fmt(s.data[hovered] ?? 0) }}
      </span>
    </figcaption>
  </figure>
</template>
