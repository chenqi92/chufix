<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: string;
    size?: 'sm' | 'md';
    tone?: 'default' | 'accent';
  }>(),
  {
    size: 'md',
    tone: 'default',
  },
);
</script>

<template>
  <span
    class="cf-typing"
    :class="[`cf-typing--${size}`, `cf-typing--${tone}`]"
    role="status"
    :aria-label="name ? `${name} 正在输入` : '正在输入'"
  >
    <span v-if="name" class="cf-typing__name">{{ name }}</span>
    <span class="cf-typing__dots" aria-hidden="true">
      <span class="cf-typing__dot" />
      <span class="cf-typing__dot" />
      <span class="cf-typing__dot" />
    </span>
  </span>
</template>
