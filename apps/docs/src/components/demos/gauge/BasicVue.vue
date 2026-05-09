<script setup lang="ts">
import { CfGauge } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 32px;">
    <CfGauge :value="42" label="CPU" unit="%" tone="success" />
    <CfGauge :value="78" label="Memory" unit="%" tone="warning" />
    <CfGauge :value="92" label="Disk" unit="%" tone="error" />
  </div>
</template>