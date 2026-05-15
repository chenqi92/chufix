<script setup lang="ts">
import { CfMapTile, CfFlowMap } from '@chufix-design/maps-vue';
import { samplePointsChina } from '../_shared/sample-geo';

const edges = [
  { from: 'BJ', to: 'SH', value: 120, label: '北京 → 上海' },
  { from: 'BJ', to: 'GZ', value: 80, label: '北京 → 广州' },
  { from: 'CD', to: 'SH', value: 60, label: '成都 → 上海' },
  { from: 'GZ', to: 'SH', value: 200, label: '广州 → 上海' },
  { from: 'SY', to: 'BJ', value: 95, label: '沈阳 → 北京' },
  { from: 'XA', to: 'SH', value: 70, label: '西安 → 上海' },
];
</script>

<template>
  <CfMapTile
    :center="{ lng: 113, lat: 33 }"
    :zoom="4"
    :width="720"
    :height="520"
  >
    <CfFlowMap
      :points="samplePointsChina"
      :edges="edges"
      :show-labels="true"
    />
  </CfMapTile>
</template>
