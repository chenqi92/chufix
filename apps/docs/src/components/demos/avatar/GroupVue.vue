<script setup lang="ts">
import { Avatar, AvatarGroup } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <AvatarGroup>
      <Avatar src="https://i.pravatar.cc/80?img=1" />
      <Avatar src="https://i.pravatar.cc/80?img=2" />
      <Avatar src="https://i.pravatar.cc/80?img=3" />
      <Avatar fallback="+5" />
    </AvatarGroup>
    <AvatarGroup :spacing="-4">
      <Avatar size="sm" name="Anna" />
      <Avatar size="sm" name="Bob" />
      <Avatar size="sm" name="Cici" />
      <Avatar size="sm" name="Dean" />
      <Avatar size="sm" fallback="+12" />
    </AvatarGroup>
  </div>
</template>
