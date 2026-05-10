<script setup lang="ts">
import { CfBarChart } from '@chufix-design/vue';

const data = [42, 68, 35, 91, 57, 78];
const labels = ['API', 'Web', 'DB', 'Cache', 'Queue', 'Worker'];
</script>

<template>
  <CfBarChart :data="data" :labels="labels" orientation="horizontal" />
</template>
