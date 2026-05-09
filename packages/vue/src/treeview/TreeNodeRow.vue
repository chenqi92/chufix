<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNode } from './variants';

interface Helpers {
  expandedSet: Set<string>;
  selectedKey: string | null;
  checkable: boolean;
  isFullyChecked: (n: TreeNode) => boolean;
  isPartiallyChecked: (n: TreeNode) => boolean;
  onToggle: (n: TreeNode) => void;
  onSelect: (n: TreeNode) => void;
  onCheck: (n: TreeNode) => void;
}

const props = defineProps<{
  node: TreeNode;
  depth: number;
  helpers: Helpers;
}>();

const hasChildren = computed(() => !!props.node.children?.length);
const isExpanded = computed(() => props.helpers.expandedSet.has(props.node.key));
const isSelected = computed(() => props.helpers.selectedKey === props.node.key);
const isChecked = computed(() => props.helpers.isFullyChecked(props.node));
const isIndeterminate = computed(() => props.helpers.isPartiallyChecked(props.node));

function onRowClick() {
  if (hasChildren.value && !props.helpers.checkable) {
    props.helpers.onToggle(props.node);
  }
  props.helpers.onSelect(props.node);
}

function onCaretClick(e: MouseEvent) {
  e.stopPropagation();
  props.helpers.onToggle(props.node);
}

function onCheckChange() {
  props.helpers.onCheck(props.node);
}

function onCheckClick(e: MouseEvent) {
  e.stopPropagation();
}
</script>

<template>
  <li class="cf-tree__item" role="none">
    <div
      class="cf-tree__row"
      :class="{
        'is-selected': isSelected,
        'is-disabled': node.disabled,
      }"
      :style="{ paddingInlineStart: `${depth * 16 + 4}px` }"
      role="treeitem"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-selected="isSelected"
      @click="onRowClick"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="cf-tree__caret"
        :class="isExpanded && 'is-open'"
        :aria-label="isExpanded ? '折叠' : '展开'"
        @click="onCaretClick"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span v-else class="cf-tree__caret cf-tree__caret--leaf" aria-hidden="true" />

      <input
        v-if="helpers.checkable"
        type="checkbox"
        class="cf-tree__checkbox"
        :checked="isChecked"
        :indeterminate.prop="isIndeterminate"
        :disabled="node.disabled"
        @click="onCheckClick"
        @change="onCheckChange"
      />

      <span v-if="node.icon" class="cf-tree__icon" v-html="node.icon" />
      <span class="cf-tree__label">{{ node.label }}</span>
    </div>

    <ul v-if="hasChildren && isExpanded" class="cf-tree__list cf-tree__list--child">
      <TreeNodeRow
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :depth="depth + 1"
        :helpers="helpers"
      />
    </ul>
  </li>
</template>
