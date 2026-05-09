<script setup lang="ts">
import { computed } from 'vue';
import { highlightClass, splitByMatch, type HighlightProps } from './variants';

const props = withDefaults(defineProps<HighlightProps>(), {
  caseSensitive: false,
});

const cls = computed(() => highlightClass({ className: props.className }));
const segments = computed(() =>
  splitByMatch(props.text, props.match, props.caseSensitive),
);
</script>

<template>
  <span :class="cls">
    <template v-for="(seg, i) in segments" :key="i">
      <mark v-if="seg.hit" class="cf-highlight__hit">{{ seg.text }}</mark>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>
