<script setup lang="ts">
import { CfBadge } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <CfBadge content="New" tone="primary" />
    <CfBadge content="3" />
    <CfBadge content="Beta" tone="info" />
    <CfBadge content="ok" tone="success" />
    <CfBadge content="hot" tone="warning" />
    <CfBadge dot tone="danger" />
  </div>
</template>
