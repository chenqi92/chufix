<script setup lang="ts">
import { CfBulletChart } from '@chufix/vue';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
    <CfBulletChart label="无质量带" :value="65" :target="80" :max="100" />
    <CfBulletChart
      label="3 段质量带"
      :value="65"
      :target="80"
      :max="100"
      :bands="[{upTo: 40, tone: 'error'}, {upTo: 75, tone: 'warning'}, {upTo: 100, tone: 'success'}]"
    />
    <CfBulletChart
      label="超过目标"
      :value="92"
      :target="80"
      :max="100"
      :bands="[{upTo: 50, tone: 'error'}, {upTo: 80, tone: 'warning'}, {upTo: 100, tone: 'success'}]"
    />
  </div>
</template>
