<script setup lang="ts">
import { computed } from 'vue';
import {
  type RequestTiming,
  PHASE_COLOR,
  formatTime,
  pickGridStep,
  totalRange,
} from './variants';

const props = withDefaults(
  defineProps<{
    requests: RequestTiming[];
    unit?: 'ms' | 's';
    rowHeight?: number;
    labelWidth?: number;
    showGrid?: boolean;
  }>(),
  {
    unit: 'ms',
    rowHeight: 22,
    labelWidth: 220,
    showGrid: true,
  },
);

const emit = defineEmits<{
  (e: 'select', request: RequestTiming): void;
}>();

const range = computed(() => totalRange(props.requests));
const span = computed(() => Math.max(1, range.value.max - range.value.min));

const gridStep = computed(() => pickGridStep(span.value));
const gridTicks = computed(() => {
  const out: number[] = [];
  for (let v = 0; v <= span.value; v += gridStep.value) out.push(v);
  return out;
});

function barLeft(r: RequestTiming): number {
  return ((r.start - range.value.min) / span.value) * 100;
}
function barWidth(r: RequestTiming): number {
  return Math.max(0.1, ((r.end - r.start) / span.value) * 100);
}
function phaseSegments(r: RequestTiming) {
  if (!r.phases || r.phases.length === 0) {
    return [{ type: 'wait' as const, leftPct: 0, widthPct: 100 }];
  }
  const total = r.phases.reduce((s, p) => s + p.duration, 0) || 1;
  let cursor = 0;
  return r.phases.map((p) => {
    const leftPct = (cursor / total) * 100;
    const widthPct = (p.duration / total) * 100;
    cursor += p.duration;
    return { type: p.type, leftPct, widthPct };
  });
}
</script>

<template>
  <div class="cf-reqt" :style="{ '--cf-reqt-label-width': `${labelWidth}px` }">
    <div v-if="showGrid" class="cf-reqt__axis">
      <div class="cf-reqt__axis-label" />
      <div class="cf-reqt__axis-grid">
        <span
          v-for="(t, i) in gridTicks"
          :key="i"
          class="cf-reqt__tick"
          :style="{ left: `${(t / span) * 100}%` }"
        >{{ formatTime(t, unit) }}</span>
      </div>
    </div>
    <div class="cf-reqt__rows" :style="{ '--cf-reqt-row-height': `${rowHeight}px` }">
      <div
        v-for="r in requests"
        :key="r.id"
        class="cf-reqt__row"
        @click="emit('select', r)"
      >
        <div class="cf-reqt__label" :title="r.label">{{ r.label }}</div>
        <div class="cf-reqt__track">
          <div
            v-if="showGrid"
            class="cf-reqt__grid"
            :style="{
              backgroundImage: `linear-gradient(to right, var(--line-1) 1px, transparent 1px)`,
              backgroundSize: `${(gridStep / span) * 100}% 100%`,
            }"
          />
          <div
            class="cf-reqt__bar"
            :class="r.tone && `cf-reqt__bar--${r.tone}`"
            :style="{ left: `${barLeft(r)}%`, width: `${barWidth(r)}%` }"
          >
            <span
              v-for="(seg, i) in phaseSegments(r)"
              :key="i"
              class="cf-reqt__seg"
              :style="{
                left: `${seg.leftPct}%`,
                width: `${seg.widthPct}%`,
                background: PHASE_COLOR[seg.type],
              }"
              :title="seg.type"
            />
          </div>
          <span class="cf-reqt__duration">{{ formatTime(r.end - r.start, unit) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
