<script setup lang="ts">
import { CfGauge } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row" style="gap: 24px;">
    <CfGauge :value="42" label="180°" unit="%" :sweep="180" />
    <CfGauge :value="60" label="270°（默认）" unit="%" :sweep="270" />
    <CfGauge :value="78" label="360°" unit="%" :sweep="360" />
  </div>
</template>
