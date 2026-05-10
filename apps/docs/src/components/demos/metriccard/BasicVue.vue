<script setup lang="ts">
import { CfMetricCard } from '@chufix-design/vue';
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
    <CfMetricCard label="今日 PV" value="12,420" :delta="8.4" :trend="[40, 45, 50, 52, 60, 65, 72]" />
    <CfMetricCard label="活跃用户" value="3,180" :delta="-2.1" :trend="[80, 78, 82, 85, 79, 76, 73]" />
    <CfMetricCard label="付费转化" value="6.2" unit="%" :delta="0.4" :trend="[50, 52, 50, 55, 56, 58, 58]" />
  </div>
</template>