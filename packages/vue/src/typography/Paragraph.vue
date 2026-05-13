<script setup lang="ts">
import { computed } from 'vue';
import { paragraphClass, type ParagraphProps } from './variants';

const props = withDefaults(defineProps<ParagraphProps>(), {
  size: 'md',
  lineClamp: 0,
});

const cls = computed(() => paragraphClass(props));
const clampStyle = computed(() =>
  props.lineClamp && props.lineClamp > 0
    ? {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: String(props.lineClamp),
        overflow: 'hidden',
      }
    : undefined,
);
</script>

<template>
  <p :class="cls" :style="clampStyle">
    <slot />
  </p>
</template>
