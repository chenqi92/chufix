<script setup lang="ts">
import { CfStat } from '@chufix-design/vue';
</script>

<template>
  <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <CfStat label="size = sm" :value="42" size="sm" variant="outlined" />
    <CfStat label="size = md" :value="42" size="md" variant="outlined" />
    <CfStat label="size = lg" :value="42" size="lg" variant="outlined" />
  </div>
</template>
