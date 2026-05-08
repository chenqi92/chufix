<script setup lang="ts">
import { Badge, Button } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1.5rem;">
    <Badge :content="3">
      <Button variant="tertiary">3 条</Button>
    </Badge>
    <Badge :content="120">
      <Button variant="tertiary">默认 max=99</Button>
    </Badge>
    <Badge :content="120" :max="999">
      <Button variant="tertiary">max=999</Button>
    </Badge>
    <Badge :content="0" show-zero tone="success">
      <Button variant="tertiary">show-zero</Button>
    </Badge>
  </div>
</template>
