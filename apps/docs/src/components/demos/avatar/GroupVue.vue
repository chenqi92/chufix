<script setup lang="ts">
import { CfAvatar, CfAvatarGroup } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfAvatarGroup>
      <CfAvatar src="https://i.pravatar.cc/80?img=1" />
      <CfAvatar src="https://i.pravatar.cc/80?img=2" />
      <CfAvatar src="https://i.pravatar.cc/80?img=3" />
      <CfAvatar fallback="+5" />
    </CfAvatarGroup>
    <CfAvatarGroup :spacing="-4">
      <CfAvatar size="sm" name="Anna" />
      <CfAvatar size="sm" name="Bob" />
      <CfAvatar size="sm" name="Cici" />
      <CfAvatar size="sm" name="Dean" />
      <CfAvatar size="sm" fallback="+12" />
    </CfAvatarGroup>
  </div>
</template>
