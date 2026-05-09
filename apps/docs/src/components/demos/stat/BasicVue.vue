<script setup lang="ts">
import { CfStat } from '@chufix/vue';
</script>

<template>
  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
    <CfStat
      label="今日访问"
      :value="12384"
      :trend="{ delta: '+12.4%', label: '环比昨日' }"
      variant="outlined"
    />
    <CfStat
      label="转化率"
      value="3.2"
      suffix="%"
      :trend="{ delta: '-0.4%', label: '环比昨日' }"
      variant="outlined"
    />
    <CfStat
      label="收入"
      :value="84520"
      prefix="¥"
      :trend="{ delta: 0, label: '与昨日持平' }"
      variant="outlined"
    />
  </div>
</template>
