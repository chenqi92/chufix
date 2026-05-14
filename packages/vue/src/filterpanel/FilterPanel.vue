<script setup lang="ts">
import type { FilterPanelProps, SavedView } from './variants';

const props = withDefaults(defineProps<FilterPanelProps>(), {
  title: '筛选',
  showFooter: true,
  applying: false,
});

const emit = defineEmits<{
  (e: 'view-change', id: string, view: SavedView): void;
  (e: 'apply'): void;
  (e: 'reset'): void;
}>();

function onViewClick(view: SavedView) {
  if (view.id === props.activeViewId) return;
  emit('view-change', view.id, view);
}
</script>

<template>
  <aside class="cf-filterpanel" role="complementary" :aria-label="title">
    <header class="cf-filterpanel__head">
      <h3 class="cf-filterpanel__title">{{ title }}</h3>
      <span v-if="activeFilters" class="cf-filterpanel__badge">{{ activeFilters }}</span>
    </header>
    <div v-if="savedViews && savedViews.length" class="cf-filterpanel__views" role="tablist" aria-label="已保存视图">
      <button
        v-for="view in savedViews"
        :key="view.id"
        type="button"
        role="tab"
        class="cf-filterpanel__view"
        :class="view.id === activeViewId && 'is-active'"
        :aria-selected="view.id === activeViewId"
        @click="onViewClick(view)"
      >
        {{ view.label }}
        <span v-if="view.count != null" class="cf-filterpanel__view-count">{{ view.count }}</span>
      </button>
    </div>
    <div class="cf-filterpanel__body">
      <slot />
    </div>
    <footer v-if="showFooter" class="cf-filterpanel__foot">
      <button type="button" class="cf-filterpanel__btn cf-filterpanel__btn--secondary" @click="emit('reset')">清空</button>
      <button
        type="button"
        class="cf-filterpanel__btn cf-filterpanel__btn--primary"
        :disabled="applying"
        @click="emit('apply')"
      >{{ applying ? '应用中...' : '应用' }}</button>
    </footer>
  </aside>
</template>
