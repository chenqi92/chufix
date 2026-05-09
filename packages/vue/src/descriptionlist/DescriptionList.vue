<script setup lang="ts">
import { computed } from 'vue';
import {
  descriptionListClass,
  type DescriptionListProps,
} from './variants';

const props = withDefaults(defineProps<DescriptionListProps>(), {
  items: () => [],
  layout: 'horizontal',
  size: 'md',
  columns: 1,
  bordered: false,
});

const cls = computed(() =>
  descriptionListClass({
    layout: props.layout,
    size: props.size,
    bordered: props.bordered,
  }),
);

const styles = computed(() => {
  const out: Record<string, string> = {};
  out['--cf-dl-cols'] = String(props.columns);
  if (props.termWidth != null) {
    const w = typeof props.termWidth === 'number' ? `${props.termWidth}px` : props.termWidth;
    out['--cf-dl-term-width'] = w;
  }
  return out;
});
</script>

<template>
  <div :class="cls" :style="styles">
    <div v-if="title" class="cf-dl__title">{{ title }}</div>
    <dl class="cf-dl__grid">
      <div
        v-for="(item, i) in items"
        :key="item.key ?? i"
        class="cf-dl__row"
        :style="item.span ? { gridColumn: `span ${item.span}` } : undefined"
      >
        <dt class="cf-dl__term">{{ item.term }}</dt>
        <dd class="cf-dl__description">
          <slot :name="item.key ?? `item-${i}`" :item="item">
            {{ item.description }}
          </slot>
        </dd>
      </div>
      <slot />
    </dl>
  </div>
</template>
