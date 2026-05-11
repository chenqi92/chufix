<script setup lang="ts">
import { CfBulletChart } from '@chufix-design/vue';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
    <CfBulletChart label="收入" :value="780" :target="900" :max="1200" :bands="[{upTo: 400, tone: 'error'}, {upTo: 700, tone: 'warning'}, {upTo: 1200, tone: 'success'}]" />
    <CfBulletChart label="留存率" :value="62" :target="70" :max="100" :bands="[{upTo: 40, tone: 'error'}, {upTo: 70, tone: 'warning'}, {upTo: 100, tone: 'success'}]" />
  </div>
</template>