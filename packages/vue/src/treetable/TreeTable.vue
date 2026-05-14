<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from 'vue';
import {
  defaultRowKey,
  flattenTree,
  type FlatTreeRow,
  type TreeTableColumn,
  type TreeTableProps,
} from './variants';

const props = withDefaults(defineProps<TreeTableProps<T>>(), {
  childrenKey: 'children',
  defaultExpandedKeys: () => [],
  indentSize: 16,
  striped: true,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'row-click', row: T, flat: FlatTreeRow<T>): void;
  (e: 'expand', id: string, expanded: boolean): void;
}>();

const expandedSet = ref(new Set(props.defaultExpandedKeys));

const flatRows = computed(() =>
  flattenTree(props.data, props.childrenKey, expandedSet.value, props.rowKey ?? defaultRowKey),
);

function toggle(id: string) {
  const next = new Set(expandedSet.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedSet.value = next;
  emit('expand', id, next.has(id));
}

function cellValue(col: TreeTableColumn<T>, row: T) {
  if (col.accessor) return col.accessor(row);
  return (row as Record<string, unknown>)[col.key];
}

function widthStyle(col: TreeTableColumn<T>) {
  if (col.width == null) return {};
  return { width: typeof col.width === 'number' ? `${col.width}px` : col.width };
}
</script>

<template>
  <div :class="['cf-treetable', `cf-treetable--${size}`, striped && 'is-striped']" role="treegrid">
    <div class="cf-treetable__head" role="row">
      <div
        v-for="(col, i) in columns"
        :key="col.key"
        class="cf-treetable__cell cf-treetable__head-cell"
        :style="widthStyle(col)"
        :data-align="col.align ?? 'left'"
        role="columnheader"
      >{{ col.label }}</div>
    </div>
    <div class="cf-treetable__body">
      <div
        v-for="flat in flatRows"
        :key="flat.id"
        class="cf-treetable__row"
        :data-depth="flat.depth"
        role="row"
        :aria-level="flat.depth + 1"
        :aria-expanded="flat.hasChildren ? flat.expanded : undefined"
        @click="emit('row-click', flat.row, flat)"
      >
        <div
          v-for="(col, ci) in columns"
          :key="col.key"
          class="cf-treetable__cell"
          :style="widthStyle(col)"
          :data-align="col.align ?? 'left'"
          role="gridcell"
        >
          <span
            v-if="ci === 0"
            class="cf-treetable__indent"
            :style="{ paddingLeft: `${flat.depth * indentSize}px` }"
          />
          <button
            v-if="ci === 0 && flat.hasChildren"
            type="button"
            class="cf-treetable__chevron"
            :class="flat.expanded && 'is-open'"
            :aria-label="flat.expanded ? '折叠' : '展开'"
            @click.stop="toggle(flat.id)"
          >
            <svg viewBox="0 0 12 12" width="10" height="10"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <span v-else-if="ci === 0" class="cf-treetable__leaf-spacer" />
          <slot :name="`cell-${col.key}`" :row="flat.row" :flat="flat" :value="cellValue(col, flat.row)">
            <span class="cf-treetable__cell-text">{{ cellValue(col, flat.row) }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
