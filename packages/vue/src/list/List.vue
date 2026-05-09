<script setup lang="ts">
import { computed } from 'vue';
import {
  groupItems,
  listClass,
  type ListItem,
  type ListProps,
} from './variants';

const props = withDefaults(defineProps<ListProps>(), {
  modelValue: null,
  size: 'md',
  variant: 'default',
  bordered: true,
  hoverable: true,
  emptyText: '暂无数据',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[] | null): void;
  (e: 'select', item: ListItem): void;
}>();

const cls = computed(() =>
  listClass({
    size: props.size,
    variant: props.variant,
    bordered: props.bordered,
    hoverable: props.hoverable,
    selectable: !!props.selectable,
  }),
);

const grouped = computed(() => groupItems(props.items));

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

function isSelected(item: ListItem) {
  return selectedSet.value.has(item.key);
}

function pick(item: ListItem) {
  if (item.disabled) return;
  if (!props.selectable) {
    emit('select', item);
    return;
  }
  if (props.selectable === 'single') {
    emit('update:modelValue', item.key);
    emit('select', item);
    return;
  }
  const next = new Set(selectedSet.value);
  if (next.has(item.key)) next.delete(item.key);
  else next.add(item.key);
  emit('update:modelValue', Array.from(next));
  emit('select', item);
}
</script>

<template>
  <div :class="cls">
    <template v-if="!items.length">
      <div class="cf-list__empty"><slot name="empty">{{ emptyText }}</slot></div>
    </template>
    <template v-else>
      <div
        v-for="[group, list] in grouped"
        :key="group ?? '__no_group__'"
        class="cf-list__group"
      >
        <div v-if="group" class="cf-list__group-label">{{ group }}</div>
        <ul class="cf-list__items">
          <li
            v-for="item in list"
            :key="item.key"
            class="cf-list__item"
            :class="{
              'is-selected': isSelected(item),
              'is-disabled': item.disabled,
            }"
            :role="selectable ? 'option' : undefined"
            :aria-selected="selectable ? isSelected(item) : undefined"
            @click="pick(item)"
          >
            <slot :item="item" :selected="isSelected(item)">
              <span v-if="item.leading" class="cf-list__leading" v-html="item.leading" />
              <span class="cf-list__body">
                <span v-if="item.label" class="cf-list__label">{{ item.label }}</span>
                <span v-if="item.description" class="cf-list__description">
                  {{ item.description }}
                </span>
              </span>
              <span v-if="item.trailing" class="cf-list__trailing" v-html="item.trailing" />
            </slot>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
