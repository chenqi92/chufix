<script setup lang="ts">
import { CfStackedBar100 } from '@chufix-design/vue';
const segments = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 9 },
  { name: 'Edge', value: 5 },
  { name: 'Other', value: 3 },
];
</script>

<template>
  <CfStackedBar100 :segments="segments" />
</template>