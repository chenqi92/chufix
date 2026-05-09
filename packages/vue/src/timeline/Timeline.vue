<script setup lang="ts">
import { computed } from 'vue';
import { timelineClass, type TimelineProps } from './variants';

const props = withDefaults(defineProps<TimelineProps>(), {
  size: 'md',
  mode: 'left',
  reverse: false,
});

const ordered = computed(() => (props.reverse ? props.items.slice().reverse() : props.items));
const cls = computed(() =>
  timelineClass({ size: props.size, mode: props.mode, className: props.className }),
);
</script>

<template>
  <ul :class="cls">
    <li
      v-for="(item, i) in ordered"
      :key="item.key ?? i"
      :class="[
        'cf-timeline__item',
        `cf-timeline__item--${item.color ?? 'primary'}`,
        i === ordered.length - 1 && 'is-last',
        mode === 'alternate' && (i % 2 === 0 ? 'is-left' : 'is-right'),
      ]"
    >
      <span class="cf-timeline__dot" aria-hidden>
        <component :is="item.icon" v-if="item.icon" />
      </span>
      <div class="cf-timeline__body">
        <div v-if="item.title" class="cf-timeline__title">{{ item.title }}</div>
        <div v-if="item.content" class="cf-timeline__content">{{ item.content }}</div>
        <div v-if="item.time" class="cf-timeline__time">{{ item.time }}</div>
      </div>
    </li>
  </ul>
</template>
