<script setup lang="ts">
import { CfStat } from '@chufix/vue';
</script>

<template>
  <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
    <CfStat label="数据加载中" :value="0" loading variant="outlined" />
    <CfStat label="正常状态" :value="123" variant="outlined" />
  </div>
</template>
