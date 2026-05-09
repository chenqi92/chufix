<script setup lang="ts">
import { computed } from 'vue';
import { parseAnsi, spanClass, type AnsiTextProps } from './variants';

const props = withDefaults(defineProps<AnsiTextProps>(), {
  size: 'md',
  wrap: true,
  preserveWhitespace: true,
});

const spans = computed(() => parseAnsi(props.text));

const cls = computed(() => [
  'cf-ansi',
  `cf-ansi--${props.size}`,
  props.wrap && 'is-wrap',
  props.preserveWhitespace && 'is-pre',
]);
</script>

<template>
  <pre :class="cls"><span
    v-for="(span, i) in spans"
    :key="i"
    :class="spanClass(span)"
  >{{ span.text }}</span></pre>
</template>
