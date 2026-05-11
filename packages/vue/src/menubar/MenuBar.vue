<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import type { MenuBarItem, MenuBarMenu, MenuBarProps } from './variants';

defineProps<MenuBarProps>();

const emit = defineEmits<{
  (e: 'select', menuId: string, itemId: string, item: MenuBarItem): void;
}>();

const openId = ref<string | null>(null);
const rootRef = ref<HTMLElement | null>(null);

function toggle(menu: MenuBarMenu) {
  openId.value = openId.value === menu.id ? null : menu.id;
  if (openId.value) document.addEventListener('mousedown', onDocClick);
  else document.removeEventListener('mousedown', onDocClick);
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) {
    openId.value = null;
    document.removeEventListener('mousedown', onDocClick);
  }
}

function pick(menu: MenuBarMenu, item: MenuBarItem) {
  if (item.disabled || item.separator) return;
  emit('select', menu.id, item.id, item);
  openId.value = null;
  document.removeEventListener('mousedown', onDocClick);
}

onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));
</script>

<template>
  <div ref="rootRef" class="cf-menubar" role="menubar">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="cf-menubar__menu"
    >
      <button
        type="button"
        class="cf-menubar__trigger"
        :class="{ 'is-open': openId === menu.id }"
        :aria-expanded="openId === menu.id"
        :aria-haspopup="'menu'"
        role="menuitem"
        @click="toggle(menu)"
        @mouseenter="openId !== null && (openId = menu.id)"
      >
        {{ menu.label }}
      </button>
      <ul v-if="openId === menu.id" class="cf-menubar__list" role="menu">
        <template v-for="(item, i) in menu.items" :key="i">
          <li
            v-if="item.separator"
            class="cf-menubar__sep"
            role="separator"
          />
          <li
            v-else
            class="cf-menubar__item"
            :class="{
              'is-disabled': item.disabled,
              'is-danger': item.danger,
            }"
            role="menuitem"
            :aria-disabled="item.disabled || undefined"
            @mousedown.prevent="pick(menu, item)"
          >
            <span class="cf-menubar__label">{{ item.label }}</span>
            <span v-if="item.shortcut" class="cf-menubar__shortcut">{{
              item.shortcut
            }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
