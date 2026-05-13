<script setup lang="ts">
import { computed } from 'vue';
import { textClass, type TextProps } from './variants';

const props = withDefaults(defineProps<TextProps>(), {
  tag: 'span',
  size: 'md',
});

const cls = computed(() => textClass(props));
</script>

<template>
  <component :is="tag" :class="cls">
    <slot />
  </component>
</template>
