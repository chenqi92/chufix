<script setup lang="ts">
import { ref } from 'vue';
import { CfLiquidFill } from '@chufix-design/vue';

const v1 = ref(0.32);
const v2 = ref(0.62);
const v3 = ref(0.88);
</script>

<template>
  <div style="display:flex;gap:24px;align-items:flex-end;justify-content:center;flex-wrap:wrap;">
    <CfLiquidFill :value="v1" :width="180" :height="180" />
    <CfLiquidFill :value="v2" :width="220" :height="220" :speed="0.6" />
    <CfLiquidFill :value="v3" :width="180" :height="180" :waves="3" />
  </div>
</template>
