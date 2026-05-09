<script setup lang="ts">
import { CfStat } from '@chufix/vue';
</script>

<template>
  <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <CfStat label="default" :value="42" hint="无边框，透明背景" />
    <CfStat label="outlined" :value="42" hint="带描边，常用做卡片" variant="outlined" />
    <CfStat label="soft" :value="42" hint="灰色软背景" variant="soft" />
  </div>
</template>
