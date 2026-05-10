<script setup lang="ts">
import { computed, ref } from 'vue';
import { flattenTreeSelect, treeSelectClass, type TreeSelectNode, type TreeSelectProps } from './variants';

const props = withDefaults(defineProps<TreeSelectProps>(), {
  placeholder: '请选择',
  multiple: false,
  searchable: false,
  clearable: false,
  disabled: false,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | undefined): void;
  (e: 'change', value: string | string[] | undefined, node?: TreeSelectNode): void;
}>();

const open = ref(false);
const query = ref('');

const flat = computed(() => flattenTreeSelect(props.options));
const selectedValues = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue;
  return props.modelValue ? [props.modelValue] : [];
});
const selectedNodes = computed(() => flat.value.filter((node) => selectedValues.value.includes(node.value)));
const label = computed(() => {
  if (!selectedNodes.value.length) return props.placeholder;
  if (props.multiple) return selectedNodes.value.map((node) => node.label).join(' / ');
  return selectedNodes.value[0].label;
});
const filtered = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  if (!keyword) return flat.value;
  return flat.value.filter((node) => `${node.label} ${node.path.join(' ')}`.toLowerCase().includes(keyword));
});
const cls = computed(() => treeSelectClass({ size: props.size, open: open.value, disabled: props.disabled }));

function commit(node: TreeSelectNode) {
  if (props.disabled || node.disabled) return;
  let next: string | string[] | undefined;
  if (props.multiple) {
    const current = new Set(selectedValues.value);
    if (current.has(node.value)) current.delete(node.value);
    else current.add(node.value);
    next = [...current];
  } else {
    next = node.value;
    open.value = false;
  }
  emit('update:modelValue', next);
  emit('change', next, node);
}

function clear(event: MouseEvent) {
  event.stopPropagation();
  const next = props.multiple ? [] : undefined;
  emit('update:modelValue', next);
  emit('change', next);
}
</script>

<template>
  <div :class="cls">
    <button
      type="button"
      class="cf-treeselect__trigger"
      :disabled="disabled"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="cf-treeselect__value" :class="{ 'is-placeholder': !selectedNodes.length }">{{ label }}</span>
      <span v-if="clearable && selectedNodes.length" class="cf-treeselect__clear" aria-hidden="true" @click="clear">×</span>
      <span class="cf-treeselect__chevron" aria-hidden="true">⌄</span>
    </button>

    <div v-if="open" class="cf-treeselect__popup" role="listbox">
      <input
        v-if="searchable"
        v-model="query"
        class="cf-treeselect__search"
        type="search"
        placeholder="搜索节点..."
      />
      <button
        v-for="node in filtered"
        :key="node.value"
        type="button"
        class="cf-treeselect__option"
        :class="{ 'is-selected': selectedValues.includes(node.value), 'is-disabled': node.disabled }"
        :style="{ '--cf-tree-depth': node.depth }"
        role="option"
        :aria-selected="selectedValues.includes(node.value)"
        :disabled="node.disabled"
        @click="commit(node)"
      >
        <span class="cf-treeselect__branch" aria-hidden="true"></span>
        <span class="cf-treeselect__label">{{ node.label }}</span>
        <span v-if="selectedValues.includes(node.value)" class="cf-treeselect__check">✓</span>
      </button>
      <div v-if="!filtered.length" class="cf-treeselect__empty">没有匹配节点</div>
    </div>
  </div>
</template>
