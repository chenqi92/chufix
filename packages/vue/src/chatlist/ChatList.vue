<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useResizeObserver } from '../composables/useResizeObserver';
import type { ChatListProps } from './variants';

const props = withDefaults(defineProps<ChatListProps>(), {
  autoScroll: true,
  stickToBottom: true,
  stickThreshold: 64,
  groupBy: 'role',
  showDateSeparators: true,
});

const scrollerRef = ref<HTMLDivElement | null>(null);
const innerRef = ref<HTMLDivElement | null>(null);
const isAtBottom = ref(true);

function checkAtBottom() {
  const el = scrollerRef.value;
  if (!el) return;
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
  isAtBottom.value = distance <= props.stickThreshold;
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  const el = scrollerRef.value;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior });
}

function onScroll() {
  checkAtBottom();
}

useResizeObserver(innerRef, () => {
  if (!props.autoScroll) return;
  if (!props.stickToBottom || isAtBottom.value) {
    scrollToBottom('auto');
  }
});

onMounted(() => {
  nextTick(() => {
    scrollToBottom('auto');
    checkAtBottom();
  });
});

watch(
  () => props.autoScroll,
  (v) => {
    if (v) scrollToBottom('smooth');
  },
);

defineExpose({ scrollToBottom });
</script>

<template>
  <div
    ref="scrollerRef"
    :class="['cf-chatlist', `cf-chatlist--group-${groupBy}`]"
    @scroll.passive="onScroll"
  >
    <div ref="innerRef" class="cf-chatlist__inner">
      <slot />
    </div>
    <button
      v-if="!isAtBottom"
      type="button"
      class="cf-chatlist__jump"
      aria-label="滚动到最新"
      @click="scrollToBottom('smooth')"
    >
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M8 3v8M4 9l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>
