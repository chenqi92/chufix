<script setup lang="ts">
import { computed } from 'vue';
import type { MapLegendProps } from './variants';

const props = withDefaults(defineProps<MapLegendProps>(), {
  kind: 'color',
  position: 'bottom-right',
  inline: false,
});

const isStepped = computed(() => !!props.stops?.length);

const continuousStops = computed(() => {
  if (props.gradient?.length) return props.gradient;
  return [];
});

function fmt(v: number | string) {
  return typeof v === 'number' ? String(v) + (props.unit ?? '') : v + (props.unit ?? '');
}
</script>

<template>
  <div
    class="cf-maplegend"
    :class="[
      `cf-maplegend--${kind}`,
      inline ? 'cf-maplegend--inline' : `cf-maplegend--corner cf-maplegend--${position}`,
    ]"
  >
    <div v-if="title" class="cf-maplegend__title">{{ title }}</div>

    <!-- Stepped -->
    <ul v-if="isStepped" class="cf-maplegend__list">
      <li
        v-for="(s, i) in stops"
        :key="i"
        class="cf-maplegend__item"
      >
        <span
          v-if="kind === 'color'"
          class="cf-maplegend__swatch"
          :style="{ background: String(s.swatch) }"
        />
        <span
          v-else
          class="cf-maplegend__bubble"
          :style="{
            width: (typeof s.swatch === 'number' ? s.swatch : 8) * 2 + 'px',
            height: (typeof s.swatch === 'number' ? s.swatch : 8) * 2 + 'px',
          }"
        />
        <span class="cf-maplegend__label">{{ s.label ?? fmt(s.value) }}</span>
      </li>
    </ul>

    <!-- Continuous color bar -->
    <div v-else-if="kind === 'color' && continuousStops.length" class="cf-maplegend__bar">
      <span
        v-for="(s, i) in continuousStops"
        :key="i"
        class="cf-maplegend__bar-stop"
        :style="{ left: (s.offset * 100) + '%', background: s.color }"
      />
    </div>

    <!-- Continuous size -->
    <div v-else-if="kind === 'size' && domain" class="cf-maplegend__size-row">
      <span class="cf-maplegend__bubble" :style="{ width: '8px', height: '8px' }" />
      <span class="cf-maplegend__bubble" :style="{ width: '16px', height: '16px' }" />
      <span class="cf-maplegend__bubble" :style="{ width: '24px', height: '24px' }" />
    </div>

    <div v-if="domain && !isStepped" class="cf-maplegend__range">
      <span>{{ fmt(domain[0]) }}</span>
      <span>{{ fmt(domain[1]) }}</span>
    </div>
  </div>
</template>
