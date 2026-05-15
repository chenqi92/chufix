<script setup lang="ts">
import { CfPresenceAvatars, type PresenceUser } from '@chufix-design/vue';

const users: PresenceUser[] = [
  { id: 'me', name: '我', self: true },
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bo' },
  { id: 'u3', name: 'Chen Qi' },
  { id: 'u4', name: 'Diana', away: true },
  { id: 'u5', name: 'Eric' },
  { id: 'u6', name: 'Fang' },
  { id: 'u7', name: 'Gina' },
];
</script>

<template>
  <CfPresenceAvatars :users="users" :max="5" />
</template>
