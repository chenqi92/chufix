<script setup lang="ts">
import type { ChartToolbarProps, LegendSeries } from './variants';

defineProps<ChartToolbarProps>();

const emit = defineEmits<{
  (e: 'series-toggle', name: string, series: LegendSeries): void;
  (e: 'action', kind: 'zoom-in' | 'zoom-out' | 'export' | 'refresh'): void;
}>();
</script>

<template>
  <header class="cf-toolbar2">
    <div class="cf-toolbar2__heading">
      <h3 v-if="title" class="cf-toolbar2__title">{{ title }}</h3>
      <span v-if="subtitle" class="cf-toolbar2__sub">{{ subtitle }}</span>
    </div>
    <ul v-if="series && series.length" class="cf-toolbar2__legend">
      <li
        v-for="s in series"
        :key="s.name"
        :class="['cf-toolbar2__legend-item', s.hidden && 'is-hidden']"
        @click="emit('series-toggle', s.name, s)"
      >
        <span :class="['cf-toolbar2__dot', `cf-chart__bar--${s.colorIndex}`]" />
        {{ s.name }}
      </li>
    </ul>
    <div class="cf-toolbar2__actions">
      <button
        v-if="showZoom"
        type="button"
        class="cf-toolbar2__btn"
        title="放大"
        @click="emit('action', 'zoom-in')"
      >+</button>
      <button
        v-if="showZoom"
        type="button"
        class="cf-toolbar2__btn"
        title="缩小"
        @click="emit('action', 'zoom-out')"
      >−</button>
      <button
        v-if="showExport"
        type="button"
        class="cf-toolbar2__btn"
        title="导出"
        @click="emit('action', 'export')"
      >↓</button>
      <button
        v-if="showRefresh"
        type="button"
        class="cf-toolbar2__btn"
        title="刷新"
        @click="emit('action', 'refresh')"
      >↻</button>
    </div>
  </header>
</template>
