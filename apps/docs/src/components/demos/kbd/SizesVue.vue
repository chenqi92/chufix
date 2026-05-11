<script setup lang="ts">
import { CfKbd } from '@chufix-design/vue';
</script>

<template>
  <div style="display:flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <CfKbd :keys="['Ctrl', 'K']" size="sm" />
    <CfKbd :keys="['Ctrl', 'K']" size="md" />
    <CfKbd :keys="['Ctrl', 'K']" size="lg" />
  </div>
</template>
