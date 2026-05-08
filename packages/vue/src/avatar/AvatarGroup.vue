<script setup lang="ts">
import { computed } from 'vue';
import type { AvatarGroupProps } from './variants';

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  size: 'md',
  shape: 'circle',
  max: 0,
  spacing: -8,
});

const groupStyle = computed(() => ({
  '--cf-avatar-spacing': `${props.spacing}px`,
}));
</script>

<template>
  <span class="cf-avatar-group" :style="groupStyle">
    <slot />
  </span>
</template>
