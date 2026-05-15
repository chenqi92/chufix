<script setup lang="ts">
import { CfPulseDot } from '@chufix-design/vue';
</script>

<template>
  <div class="pd-demo">
    <CfPulseDot tone="success" label="健康" />
    <CfPulseDot tone="info" label="同步中" />
    <CfPulseDot tone="warning" label="降级" />
    <CfPulseDot tone="error" label="不可达" />
    <CfPulseDot tone="accent" label="LIVE" size="lg" />
    <CfPulseDot tone="default" :pulse="false" label="离线" />
  </div>
</template>

<style scoped>
.pd-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
</style>
