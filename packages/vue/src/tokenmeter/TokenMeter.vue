<script setup lang="ts">
import { computed } from 'vue';
import {
  formatTokens,
  ratioTone,
  type TokenMeterProps,
  type TokenMeterTone,
} from './variants';

const props = withDefaults(defineProps<TokenMeterProps>(), {
  showLabel: true,
  showLegend: true,
  autoTone: true,
  compact: false,
});

const ratio = computed(() => (props.limit > 0 ? props.used / props.limit : 0));
const fallbackTone = computed<TokenMeterTone>(() => (props.autoTone ? ratioTone(ratio.value) : 'accent'));

interface RenderedSegment { label: string; value: number; tone: TokenMeterTone; widthPct: number; }
const renderedSegments = computed<RenderedSegment[]>(() => {
  if (!props.segments?.length) {
    return [
      {
        label: '已用',
        value: props.used,
        tone: fallbackTone.value,
        widthPct: Math.max(0, Math.min(100, ratio.value * 100)),
      },
    ];
  }
  return props.segments.map((s) => ({
    label: s.label,
    value: s.value,
    tone: s.tone ?? 'accent',
    widthPct: props.limit > 0 ? Math.max(0, (s.value / props.limit) * 100) : 0,
  }));
});

const usedDisplay = computed(() => formatTokens(props.used));
const limitDisplay = computed(() => formatTokens(props.limit));
</script>

<template>
  <div :class="['cf-tokenmeter', compact && 'cf-tokenmeter--compact']" role="meter" :aria-valuenow="used" :aria-valuemax="limit">
    <div v-if="showLabel" class="cf-tokenmeter__head">
      <span class="cf-tokenmeter__used">{{ usedDisplay }}</span>
      <span class="cf-tokenmeter__sep">/</span>
      <span class="cf-tokenmeter__limit">{{ limitDisplay }} tokens</span>
    </div>
    <div class="cf-tokenmeter__bar">
      <span
        v-for="(seg, i) in renderedSegments"
        :key="i"
        :class="['cf-tokenmeter__seg', `cf-tokenmeter__seg--${seg.tone}`]"
        :style="{ width: `${seg.widthPct}%` }"
        :title="`${seg.label}: ${formatTokens(seg.value)}`"
      />
    </div>
    <div v-if="showLegend && segments && segments.length && !compact" class="cf-tokenmeter__legend">
      <span
        v-for="(seg, i) in renderedSegments"
        :key="i"
        class="cf-tokenmeter__legend-item"
      >
        <span :class="['cf-tokenmeter__legend-dot', `cf-tokenmeter__seg--${seg.tone}`]" />
        {{ seg.label }} <span class="cf-tokenmeter__legend-value">{{ formatTokens(seg.value) }}</span>
      </span>
    </div>
  </div>
</template>
