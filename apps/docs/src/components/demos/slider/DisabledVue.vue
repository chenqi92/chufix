<script setup lang="ts">
import { CfSlider } from '@chufix-design/vue';
</script>

<template>
  <div style="width: 100%; max-width: 32rem;">
    <CfSlider :model-value="50" disabled show-value />
  </div>
</template>
