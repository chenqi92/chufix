<script setup lang="ts">
import { CfSparkline } from '@chufix/vue';
const trendUp = [3, 5, 4, 7, 6, 9, 11, 10, 13];
const trendDown = [12, 11, 13, 9, 10, 7, 8, 5, 4];
const flat = [6, 6, 7, 6, 7, 6, 6, 7, 6];
</script>

<template>
  <div class="demo-row" style="align-items: center; gap: 24px;">
    <span>上升 <CfSparkline :data="trendUp" filled smooth :color-index="0" /> 13</span>
    <span>下降 <CfSparkline :data="trendDown" filled smooth :color-index="3" /> 4</span>
    <span>平稳 <CfSparkline :data="flat" :color-index="2" /> 6</span>
  </div>
</template>