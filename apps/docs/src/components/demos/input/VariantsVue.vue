<script setup lang="ts">
import { Input } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <Input variant="outline" placeholder="outline · 默认" />
    <Input variant="filled" placeholder="filled · 灰色填充" />
    <Input variant="ghost" placeholder="ghost · 无边框，聚焦才出现" />
  </div>
</template>
