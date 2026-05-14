<script setup lang="ts">
import { ref } from 'vue';
import { useClickOutside } from '../composables/useClickOutside';
import { moveItem, type ColumnConfig, type ColumnVisibilityMenuProps, type ColumnPin } from './variants';

const props = withDefaults(defineProps<ColumnVisibilityMenuProps>(), {
  showPinning: true,
  showReorder: true,
  triggerLabel: '列设置',
  menuLabel: '列显示与排序',
});

const emit = defineEmits<{
  (e: 'update:modelValue', cols: ColumnConfig[]): void;
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);
useClickOutside(rootRef, () => (open.value = false));

function update(cols: ColumnConfig[]) {
  emit('update:modelValue', cols);
}

function toggleVisible(col: ColumnConfig) {
  if (col.locked) return;
  update(props.modelValue.map((c) => (c.key === col.key ? { ...c, visible: !c.visible } : c)));
}

function setPin(col: ColumnConfig, pinned: ColumnPin) {
  if (col.locked) return;
  update(props.modelValue.map((c) => (c.key === col.key ? { ...c, pinned } : c)));
}

let dragIndex = -1;
function onDragStart(i: number, e: DragEvent) {
  dragIndex = i;
  e.dataTransfer?.setData('text/plain', String(i));
  e.dataTransfer?.setDragImage(new Image(), 0, 0);
}
function onDragOver(e: DragEvent) {
  e.preventDefault();
}
function onDrop(i: number) {
  if (dragIndex < 0 || dragIndex === i) return;
  update(moveItem(props.modelValue, dragIndex, i));
  dragIndex = -1;
}
function move(i: number, delta: number) {
  update(moveItem(props.modelValue, i, i + delta));
}

function showAll() {
  update(props.modelValue.map((c) => (c.locked ? c : { ...c, visible: true })));
}
</script>

<template>
  <div ref="rootRef" :class="['cf-colmenu', open && 'is-open']">
    <button
      type="button"
      class="cf-colmenu__trigger"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M3 3h4v10H3zM9 3h4v10H9z M3 7h4M9 7h4 M3 11h4M9 11h4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
      </svg>
      <span>{{ triggerLabel }}</span>
    </button>

    <div v-if="open" class="cf-colmenu__panel" role="menu" :aria-label="menuLabel">
      <div class="cf-colmenu__head">
        <span class="cf-colmenu__title">{{ menuLabel }}</span>
        <button type="button" class="cf-colmenu__action" @click="showAll">全部显示</button>
      </div>
      <ul class="cf-colmenu__list">
        <li
          v-for="(col, i) in modelValue"
          :key="col.key"
          class="cf-colmenu__row"
          :class="col.locked && 'is-locked'"
          :draggable="showReorder && !col.locked"
          @dragstart="onDragStart(i, $event)"
          @dragover="onDragOver"
          @drop="onDrop(i)"
        >
          <span v-if="showReorder" class="cf-colmenu__handle" :class="col.locked && 'is-disabled'" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="12" height="12"><path d="M5 4h1v1H5zm0 3h1v1H5zm0 3h1v1H5zM10 4h1v1h-1zm0 3h1v1h-1zm0 3h1v1h-1z" fill="currentColor"/></svg>
          </span>
          <button
            type="button"
            class="cf-colmenu__check"
            :class="col.visible && 'is-checked'"
            :disabled="col.locked"
            :aria-pressed="col.visible"
            @click="toggleVisible(col)"
          >
            <svg v-if="col.visible" viewBox="0 0 16 16" width="12" height="12"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="cf-colmenu__label">{{ col.label }}</span>
          <span v-if="!showReorder" class="cf-colmenu__spacer" />
          <span v-else-if="showReorder" class="cf-colmenu__order-arrows">
            <button type="button" class="cf-colmenu__order-btn" :disabled="i === 0 || col.locked" @click="move(i, -1)" aria-label="上移">↑</button>
            <button type="button" class="cf-colmenu__order-btn" :disabled="i === modelValue.length - 1 || col.locked" @click="move(i, 1)" aria-label="下移">↓</button>
          </span>
          <span v-if="showPinning" class="cf-colmenu__pins">
            <button
              type="button"
              class="cf-colmenu__pin"
              :class="col.pinned === 'left' && 'is-active'"
              :disabled="col.locked"
              :aria-pressed="col.pinned === 'left'"
              title="固定到左"
              @click="setPin(col, col.pinned === 'left' ? null : 'left')"
            >L</button>
            <button
              type="button"
              class="cf-colmenu__pin"
              :class="col.pinned === 'right' && 'is-active'"
              :disabled="col.locked"
              :aria-pressed="col.pinned === 'right'"
              title="固定到右"
              @click="setPin(col, col.pinned === 'right' ? null : 'right')"
            >R</button>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
