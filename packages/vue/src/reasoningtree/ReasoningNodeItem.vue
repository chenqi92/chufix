<script setup lang="ts">
import { ref, computed } from 'vue';
import { type ReasoningNode, scoreColor } from './variants';

const props = withDefaults(
  defineProps<{
    node: ReasoningNode;
    depth?: number;
    showScores?: boolean;
    initialCollapsedDepth?: number;
  }>(),
  {
    depth: 0,
    showScores: true,
  },
);

const collapsed = ref(
  props.initialCollapsedDepth !== undefined && props.depth >= props.initialCollapsedDepth,
);

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0);
</script>

<template>
  <li
    class="cf-rtree__node"
    :class="{ 'is-selected': node.selected, 'has-children': hasChildren }"
  >
    <div class="cf-rtree__row">
      <button
        v-if="hasChildren"
        type="button"
        class="cf-rtree__toggle"
        :class="{ 'is-collapsed': collapsed }"
        @click="collapsed = !collapsed"
        aria-label="toggle children"
      >›</button>
      <span v-else class="cf-rtree__leaf">•</span>
      <span class="cf-rtree__thought">{{ node.thought }}</span>
      <span
        v-if="showScores && node.score !== undefined"
        class="cf-rtree__score"
        :style="{ color: scoreColor(node.score) }"
      >{{ (node.score * 100).toFixed(0) }}%</span>
    </div>
    <ul v-if="hasChildren && !collapsed" class="cf-rtree__children">
      <ReasoningNodeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :show-scores="showScores"
        :initial-collapsed-depth="initialCollapsedDepth"
      />
    </ul>
  </li>
</template>
