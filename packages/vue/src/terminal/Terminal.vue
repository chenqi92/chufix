<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { type TerminalLine, normalizeLine } from './variants';

const props = withDefaults(
  defineProps<{
    lines: (TerminalLine | string)[];
    prompt?: string;
    title?: string;
    height?: number | string;
    follow?: boolean;
    showHeader?: boolean;
  }>(),
  {
    prompt: '$',
    follow: true,
    showHeader: true,
  },
);

const scroller = ref<HTMLDivElement | null>(null);

const normalized = computed(() => props.lines.map(normalizeLine));

function scrollToBottom() {
  const el = scroller.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

watch(
  () => props.lines.length,
  async () => {
    if (!props.follow) return;
    await nextTick();
    scrollToBottom();
  },
);

const style = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
</script>

<template>
  <div class="cf-term" :style="style">
    <div v-if="showHeader" class="cf-term__header">
      <span class="cf-term__dot cf-term__dot--red" />
      <span class="cf-term__dot cf-term__dot--yellow" />
      <span class="cf-term__dot cf-term__dot--green" />
      <span v-if="title" class="cf-term__title">{{ title }}</span>
    </div>
    <div ref="scroller" class="cf-term__body">
      <div
        v-for="(line, i) in normalized"
        :key="i"
        class="cf-term__line"
        :class="line.type && `cf-term__line--${line.type}`"
      >
        <span
          v-if="line.type === 'command'"
          class="cf-term__prompt"
        >{{ prompt }}</span>
        <span class="cf-term__text">{{ line.text }}</span>
      </div>
    </div>
  </div>
</template>
