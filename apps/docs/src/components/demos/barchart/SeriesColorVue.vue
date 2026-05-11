<script setup lang="ts">
import { CfBarChart } from '@chufix-design/vue';
const data = [42, 68, 35, 91, 57, 78, 23, 64];
const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon'];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <CfBarChart :data="data" :labels="labels" :color-index="0" :height="180" />
    <CfBarChart :data="data" :labels="labels" :color-index="2" :height="180" />
    <CfBarChart :data="data" :labels="labels" :color-index="3" :height="180" />
    <CfBarChart :data="data" :labels="labels" :color-index="5" :height="180" />
  </div>
</template>
