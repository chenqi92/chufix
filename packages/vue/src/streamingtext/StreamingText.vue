<script setup lang="ts">
import { computed } from 'vue';
import { renderInlineMarkdown, type StreamingTextProps } from './variants';

const props = withDefaults(defineProps<StreamingTextProps>(), {
  done: false,
  format: 'text',
  cursor: 'blink',
});

const rendered = computed(() =>
  props.format === 'markdown' ? renderInlineMarkdown(props.text) : null,
);

const cursorClass = computed(() => {
  if (props.done || props.cursor === 'none') return '';
  return props.cursor === 'block' ? 'cf-streaming__cursor cf-streaming__cursor--block' : 'cf-streaming__cursor';
});
</script>

<template>
  <span :class="['cf-streaming', className]" aria-live="polite" aria-atomic="false">
    <span v-if="format === 'markdown'" class="cf-streaming__body" v-html="rendered" />
    <span v-else class="cf-streaming__body">{{ text }}</span>
    <span v-if="!done && cursor !== 'none'" :class="cursorClass" aria-hidden="true" />
  </span>
</template>
