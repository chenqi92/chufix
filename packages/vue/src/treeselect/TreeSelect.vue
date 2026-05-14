<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  flattenTree,
  getCheckState,
  indexTree,
  toggleCascade,
  treeSelectClass,
  type FlatTreeSelectNode,
  type TreeSelectNode,
  type TreeSelectProps,
} from './variants';

const props = withDefaults(defineProps<TreeSelectProps>(), {
  placeholder: '请选择',
  multiple: false,
  cascade: true,
  searchable: false,
  clearable: false,
  disabled: false,
  size: 'md',
  showLines: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | undefined): void;
  (e: 'change', value: string | string[] | undefined, node?: TreeSelectNode): void;
  (e: 'expand', value: string): void;
  (e: 'collapse', value: string): void;
}>();

const open = ref(false);
const query = ref('');
const rootEl = ref<HTMLDivElement | null>(null);

const index = computed(() => indexTree(props.options));
const flat = computed(() => flattenTree(props.options, index.value));

const initialExpanded = (): Set<string> => {
  if (props.defaultExpandedKeys === 'all') {
    return new Set(flat.value.filter((n) => n.isBranch).map((n) => n.value));
  }
  return new Set(props.defaultExpandedKeys ?? []);
};
const expandedSet = ref<Set<string>>(initialExpanded());

watch(
  () => props.options,
  () => {
    expandedSet.value = initialExpanded();
  },
);

const selectedValues = computed<string[]>(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue;
  return props.modelValue ? [props.modelValue] : [];
});
const selectedSet = computed(() => new Set(selectedValues.value));

const selectedNodes = computed(() =>
  selectedValues.value
    .map((v) => index.value.get(v))
    .filter((n): n is FlatTreeSelectNode => Boolean(n)),
);

const label = computed(() => {
  if (!selectedNodes.value.length) return props.placeholder;
  if (props.multiple) return selectedNodes.value.map((n) => n.label).join(' / ');
  return selectedNodes.value[0].label;
});

/** Apply search filter + collapse rule to produce final visible list. */
const visibleRows = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  // Search mode: expand all matching nodes and their ancestors automatically.
  if (keyword) {
    const matchedSelf = new Set<string>();
    for (const node of flat.value) {
      if (`${node.label} ${node.path.join(' ')}`.toLowerCase().includes(keyword)) {
        matchedSelf.add(node.value);
      }
    }
    // Include ancestors of matched nodes (so users see the context).
    const includeSet = new Set(matchedSelf);
    for (const v of matchedSelf) {
      let cur = index.value.get(v)?.parent;
      while (cur) {
        includeSet.add(cur);
        cur = index.value.get(cur)?.parent;
      }
    }
    return flat.value.filter((n) => includeSet.has(n.value));
  }
  // Normal: a node is visible if all its ancestors are expanded.
  return flat.value.filter((n) => {
    let cur = n.parent;
    while (cur) {
      if (!expandedSet.value.has(cur)) return false;
      cur = index.value.get(cur)?.parent ?? null;
    }
    return true;
  });
});

const cls = computed(() =>
  treeSelectClass({ size: props.size, open: open.value, disabled: props.disabled }),
);

function toggleExpand(node: FlatTreeSelectNode, ev: MouseEvent) {
  ev.stopPropagation();
  if (!node.isBranch) return;
  const next = new Set(expandedSet.value);
  if (next.has(node.value)) {
    next.delete(node.value);
    emit('collapse', node.value);
  } else {
    next.add(node.value);
    emit('expand', node.value);
  }
  expandedSet.value = next;
}

function commit(node: FlatTreeSelectNode) {
  if (props.disabled || node.disabled) return;
  let nextValue: string | string[] | undefined;

  if (props.multiple) {
    let nextSet: Set<string>;
    if (props.cascade && node.isBranch) {
      nextSet = toggleCascade(node, index.value, selectedSet.value);
    } else {
      nextSet = new Set(selectedSet.value);
      if (nextSet.has(node.value)) nextSet.delete(node.value);
      else nextSet.add(node.value);
    }
    nextValue = [...nextSet];
  } else {
    if (node.isBranch) {
      // Single mode: clicking a branch only toggles expansion, doesn't select.
      const next = new Set(expandedSet.value);
      if (next.has(node.value)) next.delete(node.value);
      else next.add(node.value);
      expandedSet.value = next;
      return;
    }
    nextValue = node.value;
    open.value = false;
  }
  const raw = props.options.flatMap((o) => deepFind(o, node.value)).filter(Boolean);
  emit('update:modelValue', nextValue);
  emit('change', nextValue, raw[0]);
}

function deepFind(node: TreeSelectNode, target: string): TreeSelectNode[] {
  if (node.value === target) return [node];
  for (const c of node.children ?? []) {
    const r = deepFind(c, target);
    if (r.length) return r;
  }
  return [];
}

function clearSelection(event: MouseEvent) {
  event.stopPropagation();
  const next = props.multiple ? [] : undefined;
  emit('update:modelValue', next);
  emit('change', next);
}

function onDocumentPointer(ev: PointerEvent) {
  if (!open.value) return;
  if (rootEl.value && rootEl.value.contains(ev.target as Node)) return;
  open.value = false;
}

watch(open, (value) => {
  if (typeof document === 'undefined') return;
  if (value) {
    document.addEventListener('pointerdown', onDocumentPointer);
  } else {
    document.removeEventListener('pointerdown', onDocumentPointer);
  }
});
</script>

<template>
  <div ref="rootEl" :class="cls">
    <button
      type="button"
      class="cf-treeselect__trigger"
      :disabled="disabled"
      :aria-expanded="open"
      :aria-haspopup="multiple ? 'tree' : 'listbox'"
      @click="open = !open"
    >
      <span
        class="cf-treeselect__value"
        :class="{ 'is-placeholder': !selectedNodes.length }"
      >{{ label }}</span>
      <span
        v-if="clearable && selectedNodes.length"
        class="cf-treeselect__clear"
        role="button"
        aria-label="清除"
        @click="clearSelection"
      >×</span>
      <svg
        class="cf-treeselect__chevron"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div
      v-if="open"
      class="cf-treeselect__popup"
      :role="multiple ? 'tree' : 'listbox'"
      :class="{ 'has-lines': showLines }"
    >
      <input
        v-if="searchable"
        v-model="query"
        class="cf-treeselect__search"
        type="search"
        placeholder="搜索节点..."
      />
      <div class="cf-treeselect__list">
        <div
          v-for="node in visibleRows"
          :key="node.value"
          :class="[
            'cf-treeselect__row',
            {
              'is-selected': selectedSet.has(node.value),
              'is-disabled': node.disabled,
              'is-expanded': expandedSet.has(node.value),
              'is-branch': node.isBranch,
              'is-leaf': !node.isBranch,
            },
          ]"
          :style="{ '--cf-tree-depth': node.depth }"
          :role="multiple ? 'treeitem' : 'option'"
          :aria-selected="selectedSet.has(node.value)"
          :aria-level="node.depth + 1"
          :aria-expanded="node.isBranch ? expandedSet.has(node.value) : undefined"
        >
          <span
            v-for="d in node.depth"
            :key="`g${d}`"
            class="cf-treeselect__indent"
            aria-hidden="true"
          />
          <button
            type="button"
            class="cf-treeselect__expand"
            :class="{ 'is-placeholder': !node.isBranch }"
            tabindex="-1"
            :aria-label="node.isBranch ? (expandedSet.has(node.value) ? '折叠' : '展开') : undefined"
            @click="(e) => node.isBranch && toggleExpand(node, e)"
          >
            <svg
              v-if="node.isBranch"
              class="cf-treeselect__expand-icon"
              :class="{ 'is-open': expandedSet.has(node.value) }"
              viewBox="0 0 16 16"
              width="10"
              height="10"
              aria-hidden="true"
            >
              <path d="M5 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            class="cf-treeselect__row-btn"
            :disabled="node.disabled"
            @click="commit(node)"
          >
            <span
              v-if="multiple"
              :class="[
                'cf-treeselect__checkbox',
                `is-${getCheckState(node, selectedSet)}`,
              ]"
              aria-hidden="true"
            >
              <svg
                v-if="getCheckState(node, selectedSet) === 'checked'"
                viewBox="0 0 16 16"
                width="10"
                height="10"
              >
                <path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span
                v-else-if="getCheckState(node, selectedSet) === 'indeterminate'"
                class="cf-treeselect__indeterminate-bar"
              />
            </span>
            <span class="cf-treeselect__label">{{ node.label }}</span>
            <span
              v-if="!multiple && selectedSet.has(node.value)"
              class="cf-treeselect__check"
              aria-hidden="true"
            >✓</span>
          </button>
        </div>
        <div v-if="!visibleRows.length" class="cf-treeselect__empty">没有匹配节点</div>
      </div>
    </div>
  </div>
</template>
