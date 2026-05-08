<script setup lang="ts">
import { Badge } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <Badge content="New" tone="primary" />
    <Badge content="3" />
    <Badge content="Beta" tone="info" />
    <Badge content="ok" tone="success" />
    <Badge content="hot" tone="warning" />
    <Badge dot tone="danger" />
  </div>
</template>
