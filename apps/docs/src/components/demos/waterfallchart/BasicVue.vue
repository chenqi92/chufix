<script setup lang="ts">
import { CfWaterfallChart } from '@chufix-design/vue';

const steps = [
  { label: '期初余额', value: 1200, kind: 'total' as const },
  { label: '产品收入', value: 850 },
  { label: '订阅续费', value: 420 },
  { label: '运营成本', value: -310 },
  { label: '人力支出', value: -680 },
  { label: '季中小计', value: 1480, kind: 'total' as const },
  { label: '新签客户', value: 540 },
  { label: '退款', value: -180 },
  { label: '期末余额', value: 1840, kind: 'total' as const },
];
</script>

<template>
  <CfWaterfallChart :steps="steps" :width="640" :height="280" :value-formatter="(v) => `${v >= 0 ? '+' : ''}${v} k`" />
</template>
