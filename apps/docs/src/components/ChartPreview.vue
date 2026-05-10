<script setup lang="ts">
import { defineAsyncComponent, computed, h } from 'vue';

const props = defineProps<{ chart: string }>();

const map: Record<string, () => Promise<any>> = {
  sparkline: () => import('~/components/demos/sparkline/BasicVue.vue'),
  linechart: () => import('~/components/demos/linechart/BasicVue.vue'),
  areachart: () => import('~/components/demos/areachart/BasicVue.vue'),
  candlestickchart: () => import('~/components/demos/candlestickchart/BasicVue.vue'),
  barchart: () => import('~/components/demos/barchart/BasicVue.vue'),
  histogram: () => import('~/components/demos/histogram/BasicVue.vue'),
  stackedbar100: () => import('~/components/demos/stackedbar100/BasicVue.vue'),
  bulletchart: () => import('~/components/demos/bulletchart/BasicVue.vue'),
  donutchart: () => import('~/components/demos/donutchart/BasicVue.vue'),
  funnelchart: () => import('~/components/demos/funnelchart/BasicVue.vue'),
  treemap: () => import('~/components/demos/treemap/BasicVue.vue'),
  sankeydiagram: () => import('~/components/demos/sankeydiagram/BasicVue.vue'),
  scatterplot: () => import('~/components/demos/scatterplot/BasicVue.vue'),
  boxplot: () => import('~/components/demos/boxplot/BasicVue.vue'),
  radarchart: () => import('~/components/demos/radarchart/BasicVue.vue'),
  ridgeplot: () => import('~/components/demos/ridgeplot/BasicVue.vue'),
  gauge: () => import('~/components/demos/gauge/BasicVue.vue'),
  metriccard: () => import('~/components/demos/metriccard/BasicVue.vue'),
  timingbar: () => import('~/components/demos/timingbar/BasicVue.vue'),
  latencyheatmap: () => import('~/components/demos/latencyheatmap/BasicVue.vue'),
  connectiongraph: () => import('~/components/demos/connectiongraph/BasicVue.vue'),
  charttoolbar: () => import('~/components/demos/charttoolbar/BasicVue.vue'),
};

const Comp = computed(() => {
  const loader = map[props.chart];
  if (!loader) return null;
  return defineAsyncComponent(loader);
});
</script>

<template>
  <component v-if="Comp" :is="Comp" />
  <div v-else style="padding: 8px; color: var(--fg-3); font-size: 12px;">
    {{ chart }} 需在父 svg 中使用
  </div>
</template>
