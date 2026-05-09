<script setup lang="ts">
import { computed } from 'vue';
import { kbdClass, type KbdProps } from './variants';

const props = withDefaults(defineProps<KbdProps>(), {
  keys: () => [] as string[],
  separator: '+',
  size: 'md',
});

const cls = computed(() => kbdClass({ size: props.size }));
</script>

<template>
  <span :class="cls">
    <template v-if="keys.length">
      <template v-for="(key, i) in keys" :key="i">
        <kbd class="cf-kbd__key">{{ key }}</kbd>
        <span v-if="i < keys.length - 1" class="cf-kbd__sep">{{ separator }}</span>
      </template>
    </template>
    <kbd v-else class="cf-kbd__key"><slot /></kbd>
  </span>
</template>
