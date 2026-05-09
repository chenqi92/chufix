<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  descendantKeys,
  findParents,
  treeViewClass,
  type TreeNode,
  type TreeViewProps,
} from './variants';
import TreeNodeRow from './TreeNodeRow.vue';

const props = withDefaults(defineProps<TreeViewProps>(), {
  modelValue: () => [] as string[],
  size: 'md',
  cascade: true,
  showLine: true,
  emptyText: '暂无数据',
});

const emit = defineEmits<{
  (e: 'update:modelValue', keys: string[]): void;
  (e: 'update:expandedKeys', keys: string[]): void;
  (e: 'update:selectedKey', key: string | null): void;
  (e: 'select', node: TreeNode): void;
  (e: 'expand', node: TreeNode, expanded: boolean): void;
  (e: 'check', node: TreeNode, checked: boolean): void;
}>();

const internalExpanded = ref<string[]>(props.defaultExpandedKeys ?? []);

watch(
  () => props.defaultExpandedKeys,
  (v) => {
    if (v && props.expandedKeys === undefined) internalExpanded.value = [...v];
  },
);

const expandedSet = computed(() => {
  const arr = props.expandedKeys ?? internalExpanded.value;
  return new Set(arr);
});

const checkedSet = computed(() => new Set(props.modelValue ?? []));

function isFullyChecked(node: TreeNode): boolean {
  if (!node.children?.length) return checkedSet.value.has(node.key);
  return node.children.every(isFullyChecked);
}

function isPartiallyChecked(node: TreeNode): boolean {
  if (!node.children?.length) return false;
  let some = false;
  let all = true;
  for (const c of node.children) {
    const f = isFullyChecked(c);
    const p = isPartiallyChecked(c);
    if (f || p) some = true;
    if (!f) all = false;
  }
  return some && !all;
}

function toggleExpand(node: TreeNode) {
  const set = new Set(expandedSet.value);
  const wasOpen = set.has(node.key);
  if (wasOpen) set.delete(node.key);
  else set.add(node.key);
  const next = Array.from(set);
  if (props.expandedKeys === undefined) internalExpanded.value = next;
  emit('update:expandedKeys', next);
  emit('expand', node, !wasOpen);
}

function toggleCheck(node: TreeNode) {
  if (node.disabled) return;
  const set = new Set(checkedSet.value);
  const next = !isFullyChecked(node);

  if (props.cascade) {
    const targets = [node.key, ...descendantKeys(node)];
    for (const k of targets) {
      if (next) set.add(k);
      else set.delete(k);
    }
    const parents = findParents(props.nodes, node.key);
    for (let i = parents.length - 1; i >= 0; i--) {
      const p = parents[i];
      const allOn = p.children!.every((c) => isAllDescendantsChecked(c, set));
      if (allOn) set.add(p.key);
      else set.delete(p.key);
    }
  } else {
    if (next) set.add(node.key);
    else set.delete(node.key);
  }

  emit('update:modelValue', Array.from(set));
  emit('check', node, next);
}

function isAllDescendantsChecked(node: TreeNode, set: Set<string>): boolean {
  if (!node.children?.length) return set.has(node.key);
  return node.children.every((c) => isAllDescendantsChecked(c, set));
}

function selectNode(node: TreeNode) {
  if (node.disabled || node.selectable === false) return;
  emit('update:selectedKey', node.key);
  emit('select', node);
}

const cls = computed(() =>
  treeViewClass({
    size: props.size,
    showLine: props.showLine,
    checkable: !!props.checkable,
  }),
);

const helpers = computed(() => ({
  expandedSet: expandedSet.value,
  selectedKey: props.selectedKey ?? null,
  checkable: !!props.checkable,
  isFullyChecked,
  isPartiallyChecked,
  onToggle: toggleExpand,
  onSelect: selectNode,
  onCheck: toggleCheck,
}));
</script>

<template>
  <div :class="cls" role="tree">
    <div v-if="!nodes.length" class="cf-tree__empty">{{ emptyText }}</div>
    <ul v-else class="cf-tree__list">
      <TreeNodeRow
        v-for="node in nodes"
        :key="node.key"
        :node="node"
        :depth="0"
        :helpers="helpers"
      />
    </ul>
  </div>
</template>
