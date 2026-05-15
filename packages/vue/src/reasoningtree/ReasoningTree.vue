<script setup lang="ts">
import ReasoningNodeItem from './ReasoningNodeItem.vue';
import type { ReasoningNode } from './variants';

withDefaults(
  defineProps<{
    root: ReasoningNode;
    showScores?: boolean;
    initialCollapsedDepth?: number;
  }>(),
  {
    showScores: true,
  },
);
</script>

<template>
  <div class="cf-rtree">
    <ul class="cf-rtree__root">
      <ReasoningNodeItem
        :node="root"
        :show-scores="showScores"
        :initial-collapsed-depth="initialCollapsedDepth"
      />
    </ul>
  </div>
</template>
