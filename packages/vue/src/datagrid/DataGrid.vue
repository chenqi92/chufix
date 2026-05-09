<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, watch } from 'vue';
import {
  compareCells,
  getCellValue,
  getRowKey,
  nextSortDirection,
  type TableSort,
} from '../table/variants';
import type {
  DataGridColumn,
  DataGridProps,
  DataGridCellEdit,
} from './variants';

const props = withDefaults(defineProps<DataGridProps<T>>(), {
  size: 'md',
  hoverable: true,
  emptyText: '暂无数据',
  loading: false,
  modelValue: null,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | null): void;
  (e: 'cellEdit', edit: DataGridCellEdit<T>): void;
  (e: 'columnResize', col: DataGridColumn<T>, width: number): void;
}>();

const widths = ref<Record<string, number>>(
  Object.fromEntries(
    props.columns
      .filter((c) => typeof c.width === 'number')
      .map((c) => [c.key, c.width as number]),
  ),
);

const sort = ref<TableSort | null>(null);
const editingKey = ref<string | null>(null);
const draftValue = ref('');

const sortedRows = computed(() => {
  if (!sort.value || !sort.value.direction) return props.rows;
  const col = props.columns.find((c) => c.key === sort.value!.key);
  if (!col?.sortable) return props.rows;
  const sign = sort.value.direction === 'asc' ? 1 : -1;
  return [...props.rows].sort(
    (a, b) => sign * compareCells(getCellValue(a, col), getCellValue(b, col)),
  );
});

function onSort(col: DataGridColumn<T>) {
  if (!col.sortable) return;
  if (sort.value?.key === col.key) {
    const dir = nextSortDirection(sort.value.direction);
    sort.value = dir ? { key: col.key, direction: dir } : null;
  } else {
    sort.value = { key: col.key, direction: 'asc' };
  }
}

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

function colWidthStyle(col: DataGridColumn<T>) {
  const w = widths.value[col.key] ?? col.width;
  if (w == null) return undefined;
  return { width: typeof w === 'number' ? `${w}px` : w };
}

function startResize(col: DataGridColumn<T>, e: PointerEvent) {
  if (!col.resizable) return;
  e.preventDefault();
  e.stopPropagation();
  const target = e.currentTarget as HTMLElement;
  const startX = e.clientX;
  const th = target.parentElement as HTMLElement;
  const startWidth = th.getBoundingClientRect().width;
  target.setPointerCapture(e.pointerId);

  function onMove(ev: PointerEvent) {
    const next = Math.max(col.minWidth ?? 60, startWidth + ev.clientX - startX);
    widths.value = { ...widths.value, [col.key]: next };
  }
  function onUp(ev: PointerEvent) {
    target.releasePointerCapture(ev.pointerId);
    target.removeEventListener('pointermove', onMove);
    target.removeEventListener('pointerup', onUp);
    target.removeEventListener('pointercancel', onUp);
    emit('columnResize', col, widths.value[col.key]);
  }
  target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerup', onUp);
  target.addEventListener('pointercancel', onUp);
}

function cellId(rowKey: string, colKey: string) {
  return `${rowKey}::${colKey}`;
}

function startEdit(row: T, rowIndex: number, col: DataGridColumn<T>) {
  if (!col.editable) return;
  const rk = getRowKey(row, rowIndex, props.rowKey);
  editingKey.value = cellId(rk, col.key);
  draftValue.value = String(getCellValue(row, col) ?? '');
}

function commitEdit(row: T, rowIndex: number, col: DataGridColumn<T>) {
  if (!editingKey.value) return;
  const previous = getCellValue(row, col);
  emit('cellEdit', {
    row,
    rowIndex,
    column: col,
    value: draftValue.value,
    previous,
  });
  editingKey.value = null;
  draftValue.value = '';
}

function cancelEdit() {
  editingKey.value = null;
  draftValue.value = '';
}

function onCellKeydown(e: KeyboardEvent, row: T, rowIndex: number, col: DataGridColumn<T>) {
  if (e.key === 'Enter') {
    e.preventDefault();
    commitEdit(row, rowIndex, col);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    cancelEdit();
  }
}

const rootStyle = computed(() => {
  if (props.maxHeight == null) return undefined;
  return {
    maxHeight:
      typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
  };
});
</script>

<template>
  <div
    class="cf-datagrid"
    :class="[
      `cf-datagrid--${size}`,
      hoverable && 'is-hoverable',
      loading && 'is-loading',
    ]"
  >
    <div class="cf-datagrid__scroll" :style="rootStyle">
      <table class="cf-datagrid__table">
        <colgroup>
          <col v-if="selectable === 'multiple'" style="width: 36px;" />
          <col
            v-for="col in columns"
            :key="col.key"
            :style="colWidthStyle(col)"
          />
        </colgroup>
        <thead class="cf-datagrid__head">
          <tr>
            <th
              v-if="selectable === 'multiple'"
              class="cf-datagrid__cell cf-datagrid__cell--th cf-datagrid__cell--check"
            />
            <th
              v-for="col in columns"
              :key="col.key"
              class="cf-datagrid__cell cf-datagrid__cell--th"
              :class="[
                col.align && `cf-datagrid__cell--${col.align}`,
                col.sortable && 'is-sortable',
                sort?.key === col.key && 'is-sorted',
              ]"
              @click="onSort(col)"
            >
              <span class="cf-datagrid__th-label">
                {{ col.title }}
                <svg
                  v-if="col.sortable"
                  class="cf-datagrid__sort"
                  :class="`is-${sort?.key === col.key ? sort.direction : 'idle'}`"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path d="M6 2l3 3H3z" fill="currentColor" />
                  <path d="M6 10L3 7h6z" fill="currentColor" />
                </svg>
              </span>
              <span
                v-if="col.resizable"
                class="cf-datagrid__resize"
                @pointerdown="startResize(col, $event)"
                @click.stop
              />
            </th>
          </tr>
        </thead>
        <tbody class="cf-datagrid__body">
          <tr v-if="!sortedRows.length" class="cf-datagrid__row cf-datagrid__row--empty">
            <td
              class="cf-datagrid__cell"
              :colspan="columns.length + (selectable === 'multiple' ? 1 : 0)"
            >
              {{ emptyText }}
            </td>
          </tr>
          <tr
            v-for="(row, i) in sortedRows"
            :key="getRowKey(row, i, rowKey)"
            class="cf-datagrid__row"
            :class="[
              selectedSet.has(getRowKey(row, i, rowKey)) && 'is-selected',
              selectable && 'is-clickable',
            ]"
            @click="selectable && toggleRow(getRowKey(row, i, rowKey))"
          >
            <td
              v-if="selectable === 'multiple'"
              class="cf-datagrid__cell cf-datagrid__cell--check"
            >
              <input
                type="checkbox"
                :checked="selectedSet.has(getRowKey(row, i, rowKey))"
                @click.stop
                @change="toggleRow(getRowKey(row, i, rowKey))"
              />
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              class="cf-datagrid__cell"
              :class="[
                col.align && `cf-datagrid__cell--${col.align}`,
                col.editable && 'is-editable',
              ]"
              @dblclick="startEdit(row, i, col)"
            >
              <input
                v-if="editingKey === cellId(getRowKey(row, i, rowKey), col.key)"
                v-model="draftValue"
                class="cf-datagrid__edit"
                autofocus
                @keydown="onCellKeydown($event, row, i, col)"
                @blur="commitEdit(row, i, col)"
                @click.stop
              />
              <template v-else>
                <template v-if="col.format">
                  {{ col.format(getCellValue(row, col), row, i) }}
                </template>
                <template v-else>
                  {{ getCellValue(row, col) }}
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
