<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  colLetter,
  normalizeRange,
  rangeToTSV,
  toA1,
  tsvToData,
  type CellPos,
  type CellRange,
  type SpreadsheetProps,
} from './variants';

const props = withDefaults(defineProps<SpreadsheetProps>(), {
  rows: 20,
  cols: 10,
  modelValue: () => ({}),
  colWidth: 120,
  rowHeight: 28,
  rowHeaderWidth: 44,
  readonly: false,
  disableClipboard: false,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void;
  (e: 'cell-change', payload: { cell: string; value: string }): void;
  (e: 'selection-change', range: CellRange): void;
}>();

/* selection state */
const selection = ref<CellRange>({ start: { col: 0, row: 0 }, end: { col: 0, row: 0 } });
const editing = ref<CellPos | null>(null);
const editValue = ref('');
const dragSelecting = ref(false);

const rootRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const data = computed<Record<string, string>>(() => props.modelValue);

function cellValue(col: number, row: number): string {
  return data.value[toA1(col, row)] ?? '';
}

function inSelection(col: number, row: number): boolean {
  const r = normalizeRange(selection.value);
  return col >= r.start.col && col <= r.end.col && row >= r.start.row && row <= r.end.row;
}

function isAnchor(col: number, row: number): boolean {
  return selection.value.start.col === col && selection.value.start.row === row;
}

function setSelection(start: CellPos, end?: CellPos) {
  selection.value = { start, end: end ?? start };
  emit('selection-change', selection.value);
}

function commitData(next: Record<string, string>) {
  emit('update:modelValue', next);
}

function setCell(col: number, row: number, value: string) {
  const next = { ...data.value };
  const key = toA1(col, row);
  if (value === '') delete next[key];
  else next[key] = value;
  commitData(next);
  emit('cell-change', { cell: key, value });
}

function startEdit(col: number, row: number, initial?: string) {
  if (props.readonly) return;
  editing.value = { col, row };
  editValue.value = initial ?? cellValue(col, row);
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
}

function commitEdit() {
  if (!editing.value) return;
  const { col, row } = editing.value;
  setCell(col, row, editValue.value);
  editing.value = null;
}

function cancelEdit() {
  editing.value = null;
}

function moveAnchor(dCol: number, dRow: number, extend = false) {
  const cur = selection.value.end;
  const col = Math.max(0, Math.min(props.cols - 1, cur.col + dCol));
  const row = Math.max(0, Math.min(props.rows - 1, cur.row + dRow));
  if (extend) {
    setSelection(selection.value.start, { col, row });
  } else {
    setSelection({ col, row });
  }
}

function onCellPointerDown(e: PointerEvent, col: number, row: number) {
  if (editing.value) commitEdit();
  e.preventDefault();
  if (e.shiftKey) {
    setSelection(selection.value.start, { col, row });
  } else {
    setSelection({ col, row });
  }
  dragSelecting.value = true;
  rootRef.value?.focus();
}

function onCellPointerEnter(col: number, row: number) {
  if (!dragSelecting.value) return;
  setSelection(selection.value.start, { col, row });
}

function endDragSelect() {
  dragSelecting.value = false;
}

function onCellDoubleClick(col: number, row: number) {
  startEdit(col, row);
}

function onKeydown(e: KeyboardEvent) {
  if (editing.value) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
      moveAnchor(0, 1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
      moveAnchor(e.shiftKey ? -1 : 1, 0);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
    return;
  }
  switch (e.key) {
    case 'ArrowLeft': e.preventDefault(); moveAnchor(-1, 0, e.shiftKey); break;
    case 'ArrowRight': e.preventDefault(); moveAnchor(1, 0, e.shiftKey); break;
    case 'ArrowUp': e.preventDefault(); moveAnchor(0, -1, e.shiftKey); break;
    case 'ArrowDown': e.preventDefault(); moveAnchor(0, 1, e.shiftKey); break;
    case 'Tab': e.preventDefault(); moveAnchor(e.shiftKey ? -1 : 1, 0); break;
    case 'Enter':
      e.preventDefault();
      startEdit(selection.value.end.col, selection.value.end.row);
      break;
    case 'F2':
      e.preventDefault();
      startEdit(selection.value.end.col, selection.value.end.row);
      break;
    case 'Delete':
    case 'Backspace':
      e.preventDefault();
      clearSelection();
      break;
    default: {
      // Cmd/Ctrl combos
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copySelection();
        return;
      }
      if (mod && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        copySelection();
        clearSelection();
        return;
      }
      if (mod && e.key.toLowerCase() === 'v') {
        // handled by paste event
        return;
      }
      if (mod && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelection({ col: 0, row: 0 }, { col: props.cols - 1, row: props.rows - 1 });
        return;
      }
      // Type to start editing the focused cell
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        startEdit(selection.value.end.col, selection.value.end.row, e.key);
      }
    }
  }
}

function clearSelection() {
  if (props.readonly) return;
  const r = normalizeRange(selection.value);
  const next = { ...data.value };
  for (let row = r.start.row; row <= r.end.row; row++) {
    for (let col = r.start.col; col <= r.end.col; col++) {
      delete next[toA1(col, row)];
    }
  }
  commitData(next);
}

async function copySelection() {
  if (props.disableClipboard) return;
  const tsv = rangeToTSV(data.value, selection.value);
  try { await navigator.clipboard.writeText(tsv); } catch { /* ignore */ }
}

function onPaste(e: ClipboardEvent) {
  if (props.readonly || props.disableClipboard) return;
  if (editing.value) return;
  const tsv = e.clipboardData?.getData('text/plain');
  if (!tsv) return;
  e.preventDefault();
  const start = normalizeRange(selection.value).start;
  const patch = tsvToData(tsv, start, { cols: props.cols, rows: props.rows });
  commitData({ ...data.value, ...patch });
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('pointerup', endDragSelect);
  }
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointerup', endDragSelect);
  }
});

const totalWidth = computed(() => props.rowHeaderWidth + props.cols * props.colWidth);
const totalHeight = computed(() => props.rowHeight + props.rows * props.rowHeight);

const anchorLabel = computed(() => toA1(selection.value.end.col, selection.value.end.row));
const selectionLabel = computed(() => {
  const r = normalizeRange(selection.value);
  if (r.start.col === r.end.col && r.start.row === r.end.row) return toA1(r.start.col, r.start.row);
  return `${toA1(r.start.col, r.start.row)}:${toA1(r.end.col, r.end.row)}`;
});
</script>

<template>
  <div :class="['cf-sheet', `cf-sheet--${size}`]">
    <p v-if="caption" class="cf-sheet__caption">{{ caption }}</p>
    <div class="cf-sheet__statusbar">
      <span class="cf-sheet__statusbar-name">{{ anchorLabel }}</span>
      <span class="cf-sheet__statusbar-range">{{ selectionLabel }}</span>
    </div>
    <div
      ref="rootRef"
      class="cf-sheet__frame"
      tabindex="0"
      role="grid"
      :aria-rowcount="rows + 1"
      :aria-colcount="cols + 1"
      :aria-readonly="readonly || undefined"
      :aria-label="caption ?? '电子表格'"
      :style="{ width: `${totalWidth}px` }"
      @keydown="onKeydown"
      @paste="onPaste"
    >
      <!-- Column header -->
      <div class="cf-sheet__col-head" role="row" :style="{ height: `${rowHeight}px` }">
        <div class="cf-sheet__corner" role="columnheader" :style="{ width: `${rowHeaderWidth}px` }"></div>
        <div
          v-for="c in cols"
          :key="c"
          class="cf-sheet__col-cell"
          role="columnheader"
          :class="{ 'is-active': selection.end.col === c - 1 }"
          :style="{ width: `${colWidth}px` }"
        >{{ colLetter(c - 1) }}</div>
      </div>

      <!-- Body -->
      <div class="cf-sheet__body" :style="{ height: `${rows * rowHeight}px` }">
        <div
          v-for="r in rows"
          :key="r"
          class="cf-sheet__row"
          role="row"
          :aria-rowindex="r + 1"
          :style="{ height: `${rowHeight}px` }"
        >
          <div
            class="cf-sheet__row-head"
            role="rowheader"
            :class="{ 'is-active': selection.end.row === r - 1 }"
            :style="{ width: `${rowHeaderWidth}px` }"
          >{{ r }}</div>
          <div
            v-for="c in cols"
            :key="c"
            class="cf-sheet__cell"
            role="gridcell"
            :aria-colindex="c + 1"
            :aria-selected="inSelection(c - 1, r - 1) || undefined"
            :aria-readonly="readonly || undefined"
            :class="{
              'is-selected': inSelection(c - 1, r - 1),
              'is-anchor': isAnchor(c - 1, r - 1),
              'is-editing': editing && editing.col === c - 1 && editing.row === r - 1,
            }"
            :style="{ width: `${colWidth}px` }"
            @pointerdown="(e: PointerEvent) => onCellPointerDown(e, c - 1, r - 1)"
            @pointerenter="onCellPointerEnter(c - 1, r - 1)"
            @dblclick="onCellDoubleClick(c - 1, r - 1)"
          >
            <input
              v-if="editing && editing.col === c - 1 && editing.row === r - 1"
              ref="inputRef"
              v-model="editValue"
              class="cf-sheet__input"
              @blur="commitEdit"
              @keydown.stop="onKeydown"
            />
            <span v-else class="cf-sheet__value">{{ cellValue(c - 1, r - 1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
