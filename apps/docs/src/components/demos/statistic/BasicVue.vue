<script setup lang="ts">
import { CfStatistic } from '@chufix-design/vue';
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px;">
    <CfStatistic label="今日访问" :value="12384" />
    <CfStatistic label="收入" :value="84520.42" prefix="¥" :precision="2" />
    <CfStatistic label="转化率" :value="3.2" suffix="%" :precision="1" />
  </div>
</template>
