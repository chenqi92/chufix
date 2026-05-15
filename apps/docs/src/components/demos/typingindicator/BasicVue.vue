<script setup lang="ts">
import { CfTypingIndicator } from '@chufix-design/vue';
</script>

<template>
  <div class="ti-demo">
    <CfTypingIndicator />
    <CfTypingIndicator name="Alice" />
    <CfTypingIndicator name="Bo" tone="accent" />
    <CfTypingIndicator size="sm" name="Chen" />
  </div>
</template>

<style scoped>
.ti-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
