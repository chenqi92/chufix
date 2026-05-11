<script setup lang="ts">
import { CfAvatar, CfAvatarGroup } from '@chufix-design/vue';

const avatarBlue = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 rx=%2220%22 fill=%22%23dbeafe%22/%3E%3Ccircle cx=%2240%22 cy=%2232%22 r=%2214%22 fill=%22%232563eb%22/%3E%3Cpath d=%22M16 70c4-18 16-27 24-27s20 9 24 27%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';
const avatarGreen = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 rx=%2220%22 fill=%22%23dcfce7%22/%3E%3Ccircle cx=%2240%22 cy=%2232%22 r=%2214%22 fill=%22%2316a34a%22/%3E%3Cpath d=%22M16 70c4-18 16-27 24-27s20 9 24 27%22 fill=%22%2386efac%22/%3E%3C/svg%3E';
const avatarAmber = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 rx=%2220%22 fill=%22%23fef3c7%22/%3E%3Ccircle cx=%2240%22 cy=%2232%22 r=%2214%22 fill=%22%23d97706%22/%3E%3Cpath d=%22M16 70c4-18 16-27 24-27s20 9 24 27%22 fill=%22%23fbbf24%22/%3E%3C/svg%3E';
</script>

<template>
  <div class="demo-stack">
    <CfAvatarGroup>
      <CfAvatar :src="avatarBlue" />
      <CfAvatar :src="avatarGreen" />
      <CfAvatar :src="avatarAmber" />
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
