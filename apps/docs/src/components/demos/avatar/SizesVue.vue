<script setup lang="ts">
import { Avatar } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row" style="align-items: flex-end;">
      <Avatar size="xs" name="Chen Qi" />
      <Avatar size="sm" name="Chen Qi" />
      <Avatar size="md" name="Chen Qi" />
      <Avatar size="lg" name="Chen Qi" />
      <Avatar size="xl" name="Chen Qi" />
    </div>
    <div class="demo-row">
      <Avatar shape="circle" name="Bob Smith" />
      <Avatar shape="square" name="Bob Smith" />
    </div>
  </div>
</template>
