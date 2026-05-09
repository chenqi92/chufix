<script setup lang="ts">
import { CfIcon } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; gap: 24px; align-items: center;">
    <span><CfIcon name="loader" motion="spin" size="lg" /> spin</span>
    <span><CfIcon name="circle" motion="pulse" size="lg" /> pulse</span>
    <span><CfIcon name="arrow-down" motion="bounce" size="lg" /> bounce</span>
  </div>
</template>
