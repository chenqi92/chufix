<script setup lang="ts">
import { CfChordDiagram } from '@chufix-design/vue';

const labels = ['北美', '欧洲', '亚洲', '南美', '非洲', '大洋洲'];
const matrix = [
  [0, 1200, 1800, 320, 220, 180],
  [1100, 0, 1400, 240, 380, 120],
  [1700, 1500, 0, 410, 460, 280],
  [310, 220, 380, 0, 130, 60],
  [200, 360, 420, 110, 0, 40],
  [160, 100, 240, 70, 50, 0],
];
</script>

<template>
  <CfChordDiagram :matrix="matrix" :labels="labels" :width="500" :height="500" />
</template>
