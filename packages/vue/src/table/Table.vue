<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, watch } from 'vue';
import {
  compareCells,
  getCellValue,
  getRowKey,
  nextSortDirection,
  tableClass,
  type TableProps,
  type TableColumn,
  type TableSort,
} from './variants';

const props = withDefaults(defineProps<TableProps<T>>(), {
  size: 'md',
  variant: 'default',
  hoverable: true,
  emptyText: '暂无数据',
  loading: false,
  modelValue: null,
});

const emit = defineEmits<{
  (e: 'update:sort', sort: TableSort | null): void;
  (e: 'sort-change', sort: TableSort | null): void;
  (e: 'update:modelValue', value: string | string[] | null): void;
  (e: 'row-click', row: T, index: number): void;
}>();

const internalSort = ref<TableSort | null>(props.defaultSort ?? null);

watch(
  () => props.defaultSort,
  (v) => {
    if (props.sort === undefined) internalSort.value = v ?? null;
  },
);

const activeSort = computed(() =>
  props.sort !== undefined ? (props.sort ?? null) : internalSort.value,
);

const sortedRows = computed(() => {
  const s = activeSort.value;
  if (!s || !s.direction) return props.rows;
  const col = props.columns.find((c) => c.key === s.key);
  if (!col || !col.sortable) return props.rows;
  const sign = s.direction === 'asc' ? 1 : -1;
  return [...props.rows].sort(
    (a, b) => sign * compareCells(getCellValue(a, col), getCellValue(b, col)),
  );
});

function onSort(col: TableColumn<T>) {
  if (!col.sortable) return;
  const current = activeSort.value;
  let next: TableSort | null;
  if (current?.key === col.key) {
    const dir = nextSortDirection(current.direction);
    next = dir ? { key: col.key, direction: dir } : null;
  } else {
    next = { key: col.key, direction: 'asc' };
  }
  if (props.sort === undefined) internalSort.value = next;
  emit('update:sort', next);
  emit('sort-change', next);
}

const cls = computed(() =>
  tableClass({
    size: props.size,
    variant: props.variant,
    hoverable: props.hoverable,
    loading: props.loading,
  }),
);

const selectedSet = computed(() => {
  if (props.selectable === 'multiple') {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : [];
    return new Set(arr);
  }
  if (props.selectable === 'single') {
    return new Set(props.modelValue ? [props.modelValue as string] : []);
  }
  return new Set<string>();
});

const allSelected = computed(() => {
  if (props.selectable !== 'multiple') return false;
  if (!sortedRows.value.length) return false;
  return sortedRows.value.every((row, i) =>
    selectedSet.value.has(getRowKey(row, i, props.rowKey)),
  );
});

function toggleRow(key: string) {
  if (props.selectable === 'single') {
    emit('update:modelValue', key);
    return;
  }
  if (props.selectable !== 'multiple') return;
  const next = new Set(selectedSet.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  emit('update:modelValue', Array.from(next));
}

function toggleAll() {
  if (props.selectable !== 'multiple') return;
  if (allSelected.value) {
    emit('update:modelValue', []);
  } else {
    const all = sortedRows.value.map((row, i) => getRowKey(row, i, props.rowKey));
    emit('update:modelValue', all);
  }
}

function onRowClick(row: T, i: number) {
  emit('row-click', row, i);
}

function colStyle(col: TableColumn<T>) {
  return col.width != null
    ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
    : undefined;
}

function alignClass(col: TableColumn<T>) {
  return col.align ? `cf-table__cell--${col.align}` : '';
}

function isSortKey(key: string) {
  return activeSort.value?.key === key;
}
function sortDir(key: string) {
  return isSortKey(key) ? activeSort.value!.direction : null;
}
</script>

<template>
  <div :class="cls">
    <div class="cf-table__scroll">
      <table class="cf-table__table">
        <colgroup>
          <col v-if="selectable === 'multiple'" style="width: 36px;" />
          <col
            v-for="col in columns"
            :key="col.key"
            :style="colStyle(col)"
          />
        </colgroup>
        <thead class="cf-table__head">
          <tr>
            <th v-if="selectable === 'multiple'" class="cf-table__cell cf-table__cell--check">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate.prop="!allSelected && selectedSet.size > 0"
                aria-label="全选"
                @change="toggleAll"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              class="cf-table__cell cf-table__cell--th"
              :class="[alignClass(col), col.sortable && 'is-sortable', isSortKey(col.key) && 'is-sorted']"
              @click="onSort(col)"
            >
              <span class="cf-table__th-label">
                <slot v-if="col.headerRender" :name="`header:${col.key}`">
                  {{ col.title }}
                </slot>
                <template v-else>{{ col.title }}</template>
                <svg
                  v-if="col.sortable"
                  class="cf-table__sort"
                  :class="`is-${sortDir(col.key) ?? 'idle'}`"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path d="M6 2l3 3H3z" fill="currentColor" />
                  <path d="M6 10L3 7h6z" fill="currentColor" />
                </svg>
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="cf-table__body">
          <tr v-if="!sortedRows.length" class="cf-table__row cf-table__row--empty">
            <td
              class="cf-table__cell"
              :colspan="columns.length + (selectable === 'multiple' ? 1 : 0)"
            >
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
          <tr
            v-for="(row, i) in sortedRows"
            :key="getRowKey(row, i, rowKey)"
            class="cf-table__row"
            :class="[
              selectedSet.has(getRowKey(row, i, rowKey)) && 'is-selected',
              selectable && 'is-clickable',
            ]"
            @click="
              selectable
                ? toggleRow(getRowKey(row, i, rowKey))
                : onRowClick(row, i)
            "
          >
            <td v-if="selectable === 'multiple'" class="cf-table__cell cf-table__cell--check">
              <input
                type="checkbox"
                :checked="selectedSet.has(getRowKey(row, i, rowKey))"
                :aria-label="`选中第 ${i + 1} 行`"
                @click.stop
                @change="toggleRow(getRowKey(row, i, rowKey))"
              />
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              class="cf-table__cell"
              :class="alignClass(col)"
            >
              <slot
                :name="`cell:${col.key}`"
                :row="row"
                :index="i"
                :value="getCellValue(row, col)"
              >
                <template v-if="col.format">
                  {{ col.format(getCellValue(row, col), row, i) }}
                </template>
                <template v-else>
                  {{ getCellValue(row, col) }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
