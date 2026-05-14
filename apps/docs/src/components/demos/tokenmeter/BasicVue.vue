<script setup lang="ts">
import { CfTokenMeter } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack" style="gap: 16px;">
    <CfTokenMeter :used="48230" :limit="200000" />
    <CfTokenMeter
      :used="156000"
      :limit="200000"
      :segments="[
        { label: '系统提示', value: 8400,  tone: 'info' },
        { label: '历史消息', value: 92000, tone: 'accent' },
        { label: '当前回复', value: 55600, tone: 'success' },
      ]"
    />
    <CfTokenMeter :used="195000" :limit="200000" />
  </div>
</template>
