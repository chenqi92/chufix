<script setup lang="ts">
import { computed } from 'vue';
import type { StatusBarItem, StatusBarProps } from './variants';

const props = withDefaults(defineProps<StatusBarProps>(), {
  size: 'md',
  tone: 'default',
  leftItems: () => [] as StatusBarItem[],
  centerItems: () => [] as StatusBarItem[],
  rightItems: () => [] as StatusBarItem[],
});

const emit = defineEmits<{
  (e: 'item-click', id: string, item: StatusBarItem): void;
}>();

const cls = computed(() => [
  'cf-statusbar',
  `cf-statusbar--${props.size}`,
  `cf-statusbar--${props.tone}`,
]);

function onClick(item: StatusBarItem) {
  if (item.disabled) return;
  emit('item-click', item.id, item);
}
</script>

<template>
  <div :class="cls" role="status">
    <div class="cf-statusbar__group cf-statusbar__group--left">
      <slot name="left">
        <button
          v-for="item in leftItems"
          :key="item.id"
          type="button"
          class="cf-statusbar__item"
          :class="[`cf-statusbar__item--${item.tone ?? 'default'}`, item.disabled && 'is-disabled']"
          :disabled="item.disabled"
          @click="onClick(item)"
        >
          <slot :name="`icon-${item.iconKey ?? item.id}`" />
          <span>{{ item.label }}</span>
        </button>
      </slot>
    </div>
    <div class="cf-statusbar__group cf-statusbar__group--center">
      <slot name="center">
        <button
          v-for="item in centerItems"
          :key="item.id"
          type="button"
          class="cf-statusbar__item"
          :class="[`cf-statusbar__item--${item.tone ?? 'default'}`, item.disabled && 'is-disabled']"
          :disabled="item.disabled"
          @click="onClick(item)"
        >
          <slot :name="`icon-${item.iconKey ?? item.id}`" />
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="cf-statusbar__shortcut">{{
            item.shortcut
          }}</span>
        </button>
      </slot>
    </div>
    <div class="cf-statusbar__group cf-statusbar__group--right">
      <slot name="right">
        <button
          v-for="item in rightItems"
          :key="item.id"
          type="button"
          class="cf-statusbar__item"
          :class="[`cf-statusbar__item--${item.tone ?? 'default'}`, item.disabled && 'is-disabled']"
          :disabled="item.disabled"
          @click="onClick(item)"
        >
          <slot :name="`icon-${item.iconKey ?? item.id}`" />
          <span>{{ item.label }}</span>
        </button>
      </slot>
    </div>
  </div>
</template>
