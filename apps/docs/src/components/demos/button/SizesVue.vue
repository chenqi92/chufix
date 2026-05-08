<script setup lang="ts">
import { Button } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
    <div class="demo-row">
      <Button shape="default">默认圆角</Button>
      <Button shape="pill">Pill</Button>
      <Button shape="square" aria-label="设置">⚙</Button>
    </div>
  </div>
</template>
