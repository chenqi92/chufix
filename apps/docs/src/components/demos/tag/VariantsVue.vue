<script setup lang="ts">
import { CfTag } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <CfTag variant="solid" tone="primary">solid</CfTag>
      <CfTag variant="soft" tone="primary">soft</CfTag>
      <CfTag variant="outline" tone="primary">outline</CfTag>
    </div>
    <div class="demo-row">
      <CfTag variant="solid" tone="danger">solid</CfTag>
      <CfTag variant="soft" tone="danger">soft</CfTag>
      <CfTag variant="outline" tone="danger">outline</CfTag>
    </div>
    <div class="demo-row">
      <CfTag size="sm" tone="success">sm</CfTag>
      <CfTag size="md" tone="success">md</CfTag>
      <CfTag size="lg" tone="success">lg</CfTag>
      <CfTag tone="success" rounded>rounded</CfTag>
    </div>
  </div>
</template>
