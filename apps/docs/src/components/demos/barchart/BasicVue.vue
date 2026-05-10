<script setup lang="ts">
import { CfBarChart } from '@chufix-design/vue';
const data = [42, 68, 35, 91, 57, 78, 23, 64, 49];
const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue'];
</script>

<template>
  <CfBarChart :data="data" :labels="labels" />
</template>