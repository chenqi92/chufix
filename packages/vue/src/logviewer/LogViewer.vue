<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import {
  type LogEntry,
  type LogLevel,
  formatTimestamp,
  highlight,
} from './variants';

const props = withDefaults(
  defineProps<{
    logs: LogEntry[];
    follow?: boolean;
    search?: string;
    height?: number | string;
    showTimestamp?: boolean;
    showLevel?: boolean;
    showSource?: boolean;
    levels?: LogLevel[];
  }>(),
  {
    follow: true,
    height: 320,
    showTimestamp: true,
    showLevel: true,
    showSource: false,
  },
);

const emit = defineEmits<{
  (e: 'follow-change', following: boolean): void;
}>();

const scroller = ref<HTMLDivElement | null>(null);
const atBottom = ref(true);

const filtered = computed(() => {
  if (!props.levels || props.levels.length === 0) return props.logs;
  return props.logs.filter((l) => (l.level ? props.levels!.includes(l.level) : true));
});

function isNearBottom(): boolean {
  const el = scroller.value;
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < 8;
}

function onScroll() {
  const wasBottom = atBottom.value;
  atBottom.value = isNearBottom();
  if (wasBottom !== atBottom.value) emit('follow-change', atBottom.value);
}

function scrollToBottom() {
  const el = scroller.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

watch(
  () => filtered.value.length,
  async () => {
    if (props.follow && atBottom.value) {
      await nextTick();
      scrollToBottom();
    }
  },
);

onMounted(scrollToBottom);

const style = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
</script>

<template>
  <div class="cf-logv" :style="style">
    <div
      ref="scroller"
      class="cf-logv__scroller"
      @scroll="onScroll"
    >
      <div
        v-for="(log, i) in filtered"
        :key="log.id ?? i"
        class="cf-logv__row"
        :class="log.level && `cf-logv__row--${log.level}`"
      >
        <span v-if="showTimestamp" class="cf-logv__ts">{{ formatTimestamp(log.timestamp) }}</span>
        <span v-if="showLevel && log.level" class="cf-logv__level">{{ log.level.toUpperCase() }}</span>
        <span v-if="showSource && log.source" class="cf-logv__source">{{ log.source }}</span>
        <span class="cf-logv__msg">
          <template v-for="(seg, j) in highlight(log.message, search ?? '')" :key="j">
            <mark v-if="seg.match" class="cf-logv__match">{{ seg.text }}</mark>
            <template v-else>{{ seg.text }}</template>
          </template>
        </span>
      </div>
    </div>
    <button
      v-if="!atBottom"
      type="button"
      class="cf-logv__follow"
      @click="scrollToBottom"
    >↓ 跳到底部</button>
  </div>
</template>
