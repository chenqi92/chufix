<script setup lang="ts">
import { Avatar, AvatarGroup } from '@chukit/vue';
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
      <Avatar name="Anna Lee" />
      <Avatar name="Bob Smith" shape="square" />
      <Avatar src="https://i.pravatar.cc/80?img=12" alt="头像" />
      <Avatar src="https://example.com/__broken__.png" name="Fallback Test" />
      <Avatar fallback="?" />
    </div>
    <AvatarGroup>
      <Avatar name="Chen Qi" />
      <Avatar name="Anna Lee" />
      <Avatar name="Bob Smith" />
      <Avatar fallback="+5" />
    </AvatarGroup>
  </div>
</template>
