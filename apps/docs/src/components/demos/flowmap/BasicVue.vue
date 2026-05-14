<script setup lang="ts">
import { CfFlowMap } from '@chufix-design/vue';
import { sampleGeo, samplePoints } from '../_shared/sample-geo';

const edges = [
  { from: 'BJ', to: 'SH', value: 120, label: '北京 → 上海' },
  { from: 'BJ', to: 'GZ', value: 80, label: '北京 → 广州' },
  { from: 'CD', to: 'SH', value: 60, label: '成都 → 上海' },
  { from: 'GZ', to: 'SH', value: 200, label: '广州 → 上海' },
];
</script>

<template>
  <CfFlowMap
    :geojson="sampleGeo"
    :points="samplePoints"
    :edges="edges"
    :showLabels="true"
    :width="480"
    :height="280"
  />
</template>
