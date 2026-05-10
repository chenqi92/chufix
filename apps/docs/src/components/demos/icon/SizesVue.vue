<script setup lang="ts">
import { CfIcon } from '@chufix-design/vue';
</script>

<template>
  <div style="display:flex; gap: 16px; align-items: center;">
    <span><CfIcon name="search" size="xs" /> xs</span>
    <span><CfIcon name="search" size="sm" /> sm</span>
    <span><CfIcon name="search" size="md" /> md</span>
    <span><CfIcon name="search" size="lg" /> lg</span>
    <span><CfIcon name="search" size="xl" /> xl</span>
    <span><CfIcon name="search" :size="32" /> 32px</span>
  </div>
</template>
