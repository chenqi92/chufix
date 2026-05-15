<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'success' | 'warning' | 'error' | 'info' | 'accent' | 'default';
    size?: 'sm' | 'md' | 'lg';
    pulse?: boolean;
    label?: string;
  }>(),
  {
    tone: 'success',
    size: 'md',
    pulse: true,
  },
);
</script>

<template>
  <span class="cf-pulse" :class="[`cf-pulse--${tone}`, `cf-pulse--${size}`, { 'is-pulse': pulse }]">
    <span class="cf-pulse__dot" />
    <span v-if="pulse" class="cf-pulse__ring" />
    <span v-if="label" class="cf-pulse__label">{{ label }}</span>
  </span>
</template>
