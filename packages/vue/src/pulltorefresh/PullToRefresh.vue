<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDrag } from '../composables/useDrag';
import type { PullStage, PullToRefreshProps } from './variants';

const props = withDefaults(defineProps<PullToRefreshProps>(), {
  threshold: 64,
  maxDistance: 96,
  refreshing: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'update:refreshing', v: boolean): void;
}>();

const scrollerRef = ref<HTMLDivElement | null>(null);
const offset = ref(0);
const internalRefreshing = ref(false);
const isRefreshing = computed(() => props.refreshing || internalRefreshing.value);

const stage = computed<PullStage>(() => {
  if (isRefreshing.value) return 'refreshing';
  if (offset.value <= 0) return 'idle';
  return offset.value >= props.threshold ? 'ready' : 'pulling';
});

watch(
  () => props.refreshing,
  (v) => {
    if (!v) offset.value = 0;
  },
);

useDrag(scrollerRef, {
  axis: 'y',
  onStart() {
    if (props.disabled || isRefreshing.value) return;
    if (scrollerRef.value && scrollerRef.value.scrollTop > 0) return;
  },
  onMove(s) {
    if (props.disabled || isRefreshing.value) return;
    if (s.dy <= 0) {
      offset.value = 0;
      return;
    }
    if (scrollerRef.value && scrollerRef.value.scrollTop > 0) {
      offset.value = 0;
      return;
    }
    // resistance: ease toward maxDistance
    const eased = props.maxDistance * (1 - Math.exp(-s.dy / props.maxDistance));
    offset.value = eased;
  },
  onEnd() {
    if (props.disabled || isRefreshing.value) return;
    if (offset.value >= props.threshold) {
      internalRefreshing.value = true;
      offset.value = props.threshold;
      emit('update:refreshing', true);
      const result = emit('refresh') as unknown;
      // If consumer doesn't pass refreshing prop, auto-clear after fake delay
      // (consumer should set refreshing back to false after their async op)
      Promise.resolve(result).finally(() => {
        if (props.refreshing) return; // controlled
        internalRefreshing.value = false;
        emit('update:refreshing', false);
        offset.value = 0;
      });
    } else {
      offset.value = 0;
    }
  },
});

const indicatorStyle = computed(() => ({
  height: `${offset.value || (isRefreshing.value ? props.threshold : 0)}px`,
  transition: stage.value === 'pulling' ? 'none' : 'height var(--dur-fast) var(--ease-out)',
}));

const rotationDeg = computed(() => {
  if (isRefreshing.value) return 0;
  const ratio = Math.min(1, offset.value / props.threshold);
  return Math.round(180 * ratio);
});
</script>

<template>
  <div ref="scrollerRef" class="cf-ptr" :data-stage="stage">
    <div class="cf-ptr__indicator" :style="indicatorStyle">
      <span class="cf-ptr__spinner" :class="isRefreshing && 'is-spinning'">
        <svg
          v-if="!isRefreshing"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
          :style="{ transform: `rotate(${rotationDeg}deg)`, transition: 'transform 80ms linear' }"
        >
          <path d="M8 2v10M4 8l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg
          v-else
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
          class="cf-ptr__spinner-arc"
        >
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="20 12" />
        </svg>
      </span>
      <span class="cf-ptr__label">
        <slot v-if="stage === 'pulling'" name="pulling">下拉刷新</slot>
        <slot v-else-if="stage === 'ready'" name="ready">释放刷新</slot>
        <slot v-else-if="stage === 'refreshing'" name="refreshing">加载中...</slot>
      </span>
    </div>
    <div class="cf-ptr__content">
      <slot />
    </div>
  </div>
</template>
