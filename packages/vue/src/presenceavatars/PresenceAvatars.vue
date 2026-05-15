<script setup lang="ts">
import { computed } from 'vue';
import { type PresenceUser, colorForUser, initials } from './variants';

const props = withDefaults(
  defineProps<{
    users: PresenceUser[];
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    showSelfFirst?: boolean;
  }>(),
  {
    max: 5,
    size: 'md',
    showSelfFirst: true,
  },
);

const ordered = computed(() => {
  if (!props.showSelfFirst) return props.users;
  return [...props.users].sort((a, b) => Number(!!b.self) - Number(!!a.self));
});

const visible = computed(() => ordered.value.slice(0, props.max));
const overflow = computed(() => Math.max(0, ordered.value.length - props.max));
</script>

<template>
  <div class="cf-presence" :class="`cf-presence--${size}`">
    <div
      v-for="user in visible"
      :key="user.id"
      class="cf-presence__avatar"
      :class="{ 'is-self': user.self, 'is-away': user.away }"
      :title="user.name + (user.self ? ' (你)' : '')"
      :style="{ '--cf-presence-color': colorForUser(user) }"
    >
      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
      <span v-else>{{ initials(user.name) }}</span>
    </div>
    <div
      v-if="overflow > 0"
      class="cf-presence__overflow"
      :title="`还有 ${overflow} 人`"
    >+{{ overflow }}</div>
  </div>
</template>
