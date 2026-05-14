<script setup lang="ts">
import { CfMapScale } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-scope">
    <CfMapScale inline :lat="0" :zoom="2" unit="metric" />
    <CfMapScale inline :lat="40" :zoom="8" unit="metric" />
    <CfMapScale inline :lat="40" :zoom="14" unit="metric" />
    <CfMapScale inline :lat="40" :zoom="14" unit="imperial" />
  </div>
</template>

<style scoped>
.demo-scope { display: flex; flex-wrap: wrap; gap: 24px; }
</style>
