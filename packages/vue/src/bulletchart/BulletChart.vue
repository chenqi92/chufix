<script setup lang="ts">
import { computed } from 'vue';
import type { BulletChartProps } from './variants';

const props = withDefaults(defineProps<BulletChartProps>(), {
  width: 240,
  height: 20,
  bands: () => [],
});

const segs = computed(() => {
  const bands = props.bands ?? [];
  const out: { x: number; w: number; tone: string }[] = [];
  let prev = 0;
  for (const b of bands) {
    const x = (prev / props.max) * 100;
    const end = Math.min(b.upTo, props.max);
    const w = ((end - prev) / props.max) * 100;
    out.push({ x, w, tone: b.tone ?? 'default' });
    prev = end;
  }
  return out;
});

const valuePct = computed(() => Math.min(100, (props.value / props.max) * 100));
const targetPct = computed(() =>
  props.target == null ? null : (props.target / props.max) * 100,
);
</script>

<template>
  <div class="cf-bullet" role="img" :aria-label="ariaLabel ?? label ?? '子弹图'">
    <div v-if="label" class="cf-bullet__label">{{ label }}</div>
    <div class="cf-bullet__track" :style="{ height: `${height}px` }">
      <span
        v-for="(s, i) in segs"
        :key="i"
        :class="['cf-bullet__band', `cf-bullet__band--${s.tone}`]"
        :style="{ left: `${s.x}%`, width: `${s.w}%` }"
      />
      <span
        class="cf-bullet__value"
        :style="{ width: `${valuePct}%` }"
      />
      <span
        v-if="targetPct != null"
        class="cf-bullet__target"
        :style="{ left: `${targetPct}%` }"
      />
    </div>
  </div>
</template>
