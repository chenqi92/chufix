<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { LiquidFillProps } from './variants';

const props = withDefaults(defineProps<LiquidFillProps>(), {
  width: 240,
  height: 240,
  amplitude: 6,
  wavelength: 0.6,
  speed: 0.4,
  waves: 2,
  shape: 'circle',
});

const phase = ref(0);
let rafId: number | null = null;
let last = 0;
let reduced = false;

function tick(t: number) {
  if (!last) last = t;
  const dt = (t - last) / 1000;
  last = t;
  if (!reduced && props.speed > 0) {
    phase.value = (phase.value + props.speed * dt) % 1;
  }
  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  rafId = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
});

const uid = Math.random().toString(36).slice(2, 9);
const clipId = `cflq-${uid}`;

function buildWavePath(p: number, layer: number, value: number, w: number, h: number) {
  const amp = props.amplitude * (1 - layer * 0.25);
  const wl = w * props.wavelength;
  const yLevel = h * (1 - Math.max(0, Math.min(1, value)));
  const step = 4;
  const offset = (p + layer * 0.33) * wl * 2;
  let d = `M ${-amp} ${h}`;
  d += ` L ${-amp} ${yLevel}`;
  for (let x = -amp; x <= w + amp; x += step) {
    const phase = ((x + offset) / wl) * Math.PI * 2;
    const y = yLevel + Math.sin(phase) * amp;
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += ` L ${w + amp} ${h} Z`;
  return d;
}

const layout = computed(() => {
  const w = props.width;
  const h = props.height;
  const cx = w / 2;
  const cy = h / 2;
  const value = Math.max(0, Math.min(1, props.value));
  const layers = Array.from({ length: Math.max(1, Math.min(3, props.waves)) }, (_, i) => ({
    d: buildWavePath(phase.value, i, value, w, h),
    opacity: 0.85 - i * 0.22,
  }));
  return {
    cx,
    cy,
    radius: Math.min(w, h) / 2 - 4,
    value,
    layers,
    label: props.label ?? `${Math.round(value * 100)}%`,
  };
});
</script>

<template>
  <svg
    class="cf-chart cf-liquidfill"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? `液体填充 ${Math.round(layout.value * 100)}%`"
  >
    <defs>
      <clipPath :id="clipId">
        <circle
          v-if="shape === 'circle'"
          :cx="layout.cx"
          :cy="layout.cy"
          :r="layout.radius"
        />
        <rect v-else x="2" y="2" :width="width - 4" :height="height - 4" rx="8" />
      </clipPath>
    </defs>
    <circle
      v-if="shape === 'circle'"
      class="cf-liquidfill__rim"
      :cx="layout.cx"
      :cy="layout.cy"
      :r="layout.radius"
    />
    <rect
      v-else
      class="cf-liquidfill__rim"
      x="2"
      y="2"
      :width="width - 4"
      :height="height - 4"
      rx="8"
    />
    <g :clip-path="`url(#${clipId})`">
      <rect
        class="cf-liquidfill__bg"
        x="0"
        y="0"
        :width="width"
        :height="height"
      />
      <path
        v-for="(wave, i) in layout.layers"
        :key="i"
        class="cf-liquidfill__wave"
        :class="`cf-liquidfill__wave--${i}`"
        :d="wave.d"
        :style="{ opacity: wave.opacity }"
      />
    </g>
    <text
      :x="layout.cx"
      :y="layout.cy + 6"
      text-anchor="middle"
      class="cf-liquidfill__label"
    >{{ layout.label }}</text>
  </svg>
</template>
