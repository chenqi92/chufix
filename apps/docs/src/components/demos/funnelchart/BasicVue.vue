<script setup lang="ts">
import { CfFunnelChart } from '@chufix-design/vue';
const steps = [
  { label: '访问', value: 10000 },
  { label: '注册', value: 3200 },
  { label: '激活', value: 1800 },
  { label: '付费', value: 580 },
  { label: '续订', value: 410 },
];
</script>

<template>
  <CfFunnelChart :steps="steps" />
</template>