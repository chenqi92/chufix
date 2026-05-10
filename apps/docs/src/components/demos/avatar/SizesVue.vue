<script setup lang="ts">
import { CfAvatar } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row" style="align-items: flex-end;">
      <CfAvatar size="xs" name="Chen Qi" />
      <CfAvatar size="sm" name="Chen Qi" />
      <CfAvatar size="md" name="Chen Qi" />
      <CfAvatar size="lg" name="Chen Qi" />
      <CfAvatar size="xl" name="Chen Qi" />
    </div>
    <div class="demo-row">
      <CfAvatar shape="circle" name="Bob Smith" />
      <CfAvatar shape="square" name="Bob Smith" />
    </div>
  </div>
</template>
