<script setup lang="ts">
import { Button } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <Button tone="primary">Primary</Button>
    <Button tone="primary" variant="soft">Soft</Button>
    <Button tone="primary" variant="outline">Outline</Button>
  </div>
  <div class="demo-row">
    <Button tone="danger">Danger</Button>
    <Button tone="danger" variant="soft">Soft</Button>
    <Button tone="danger" variant="outline">Outline</Button>
  </div>
</template>
