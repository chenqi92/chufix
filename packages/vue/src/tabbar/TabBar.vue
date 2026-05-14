<script setup lang="ts">
import { computed } from 'vue';
import type { TabBarItem, TabBarProps } from './variants';

const props = withDefaults(defineProps<TabBarProps>(), {
  fixed: true,
  safeArea: true,
  variant: 'line',
  ariaLabel: '主导航',
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: string, item: TabBarItem): void;
}>();

const useSafeArea = computed(() => props.fixed && props.safeArea);

function isActive(item: TabBarItem) {
  return item.key === props.modelValue;
}

function onSelect(item: TabBarItem) {
  if (item.disabled) return;
  if (item.key === props.modelValue) return;
  emit('update:modelValue', item.key);
  emit('change', item.key, item);
}

function showBadge(b: TabBarItem['badge']) {
  return b !== undefined && b !== '' && b !== 0;
}
</script>

<template>
  <nav
    :class="[
      'cf-tabbar',
      `cf-tabbar--${variant}`,
      fixed && 'cf-tabbar--fixed',
      useSafeArea && 'cf-tabbar--safe-area',
    ]"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      role="tab"
      :aria-selected="isActive(item)"
      :aria-disabled="item.disabled || undefined"
      :disabled="item.disabled"
      :class="['cf-tabbar__item', isActive(item) && 'is-active']"
      @click="onSelect(item)"
    >
      <span class="cf-tabbar__icon" aria-hidden="true">
        <slot :name="`icon-${item.key}`" :item="item">
          <svg v-if="item.iconPath" viewBox="0 0 24 24" width="22" height="22"><path :d="item.iconPath" fill="currentColor" /></svg>
        </slot>
        <span v-if="showBadge(item.badge)" class="cf-tabbar__badge">{{ item.badge }}</span>
      </span>
      <span v-if="item.label" class="cf-tabbar__label">{{ item.label }}</span>
    </button>
  </nav>
</template>
