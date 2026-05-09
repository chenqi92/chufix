<script setup lang="ts">
import { computed } from 'vue';
import JsonNode from './JsonNode.vue';
import { jsonViewerClass, type JsonViewerProps } from './variants';

const props = withDefaults(defineProps<JsonViewerProps>(), {
  defaultExpandDepth: 1,
  size: 'md',
  bordered: true,
  lineNumbers: false,
  showTypes: false,
});

const cls = computed(() =>
  jsonViewerClass({
    size: props.size,
    bordered: props.bordered,
    lineNumbers: props.lineNumbers,
  }),
);
</script>

<template>
  <div :class="cls">
    <JsonNode
      :data="data"
      :depth="0"
      :default-expand-depth="defaultExpandDepth"
      :show-types="showTypes"
    />
  </div>
</template>
