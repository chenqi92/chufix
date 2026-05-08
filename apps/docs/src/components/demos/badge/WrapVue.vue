<script setup lang="ts">
import { Avatar, Badge, Button } from '@chufix/vue';
</script>

<template>
  <div class="demo-row" style="gap: 1.5rem;">
    <Badge :content="5">
      <Button variant="tertiary">收件箱</Button>
    </Badge>
    <Badge dot tone="success">
      <Avatar name="Chen Qi" />
    </Badge>
    <Badge dot tone="warning" placement="bottom-right">
      <Avatar name="Anna Lee" />
    </Badge>
    <Badge content="Pro" tone="info" placement="top-left">
      <Button variant="tertiary">账户</Button>
    </Badge>
  </div>
</template>
