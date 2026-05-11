<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ContextMenuItem, ContextMenuProps } from './variants';

const props = withDefaults(defineProps<ContextMenuProps>(), {
  disabled: false,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'select', value: string, item: ContextMenuItem): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const open = ref(false);
const pos = ref<{ top: number; left: number }>({ top: 0, left: 0 });
const menuRef = ref<HTMLUListElement | null>(null);
const triggerRef = ref<HTMLSpanElement | null>(null);
const canRender = ref(false);

onMounted(() => {
  canRender.value = true;
});

function clampToViewport() {
  const el = menuRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  let { top, left } = pos.value;
  if (left + rect.width > vw - 4) left = vw - rect.width - 4;
  if (top + rect.height > vh - 4) top = vh - rect.height - 4;
  if (left < 4) left = 4;
  if (top < 4) top = 4;
  pos.value = { top, left };
}

async function show(x: number, y: number) {
  if (props.disabled) return;
  pos.value = { top: y, left: x };
  open.value = true;
  emit('open');
  document.addEventListener('mousedown', onDocMouseDown);
  document.addEventListener('keydown', onKeyDown);
  await nextTick();
  clampToViewport();
}

function close() {
  if (!open.value) return;
  open.value = false;
  emit('close');
  document.removeEventListener('mousedown', onDocMouseDown);
  document.removeEventListener('keydown', onKeyDown);
}

function onDocMouseDown(e: MouseEvent) {
  if (!menuRef.value) return;
  if (!menuRef.value.contains(e.target as Node)) close();
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

function onTriggerContextMenu(e: MouseEvent) {
  e.preventDefault();
  show(e.clientX + window.scrollX, e.clientY + window.scrollY);
}

function pick(item: ContextMenuItem) {
  if (item.disabled || item.separator) return;
  emit('select', item.value ?? item.label ?? '', item);
  close();
}

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocMouseDown);
  document.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <span
    ref="triggerRef"
    class="cf-ctxmenu__trigger"
    @contextmenu="onTriggerContextMenu"
  >
    <slot />
  </span>
  <Teleport v-if="canRender" :to="to">
    <ul
      v-if="open"
      ref="menuRef"
      class="cf-ctxmenu"
      role="menu"
      :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
    >
      <template v-for="(item, i) in items" :key="i">
        <li
          v-if="item.separator"
          class="cf-ctxmenu__sep"
          role="separator"
        />
        <li
          v-else
          class="cf-ctxmenu__item"
          :class="{
            'is-disabled': item.disabled,
            'is-danger': item.danger,
          }"
          role="menuitem"
          :aria-disabled="item.disabled || undefined"
          @mousedown.prevent="pick(item)"
        >
          <span class="cf-ctxmenu__label">{{ item.label }}</span>
          <span v-if="item.shortcut" class="cf-ctxmenu__shortcut">{{
            item.shortcut
          }}</span>
        </li>
      </template>
    </ul>
  </Teleport>
</template>
