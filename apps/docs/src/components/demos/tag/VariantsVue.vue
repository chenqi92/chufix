<script setup lang="ts">
import { Tag } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <Tag variant="solid" tone="primary">solid</Tag>
      <Tag variant="soft" tone="primary">soft</Tag>
      <Tag variant="outline" tone="primary">outline</Tag>
    </div>
    <div class="demo-row">
      <Tag variant="solid" tone="danger">solid</Tag>
      <Tag variant="soft" tone="danger">soft</Tag>
      <Tag variant="outline" tone="danger">outline</Tag>
    </div>
    <div class="demo-row">
      <Tag size="sm" tone="success">sm</Tag>
      <Tag size="md" tone="success">md</Tag>
      <Tag size="lg" tone="success">lg</Tag>
      <Tag tone="success" rounded>rounded</Tag>
    </div>
  </div>
</template>
