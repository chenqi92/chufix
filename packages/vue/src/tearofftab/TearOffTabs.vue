<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TearOffTabItem, TearOffTabsProps } from './variants';

const props = withDefaults(defineProps<TearOffTabsProps>(), {
  modelValue: undefined,
  tearThreshold: 60,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'tear-off', id: string, item: TearOffTabItem, x: number, y: number): void;
  (e: 'close', id: string, item: TearOffTabItem): void;
}>();

const activeId = computed(() =>
  props.modelValue ?? props.tabs[0]?.id ?? null,
);

const dragId = ref<string | null>(null);
const dragOffsetY = ref(0);

function setActive(id: string) {
  emit('update:modelValue', id);
}

function close(item: TearOffTabItem) {
  emit('close', item.id, item);
}

function onPointerDown(item: TearOffTabItem, e: PointerEvent) {
  dragId.value = item.id;
  dragOffsetY.value = e.clientY;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(item: TearOffTabItem, e: PointerEvent) {
  if (dragId.value !== item.id) return;
  if (Math.abs(e.clientY - dragOffsetY.value) > props.tearThreshold) {
    emit('tear-off', item.id, item, e.clientX, e.clientY);
    dragId.value = null;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }
}

function onPointerUp(e: PointerEvent) {
  dragId.value = null;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
}
</script>

<template>
  <div class="cf-tearoff">
    <div class="cf-tearoff__bar" role="tablist">
      <div
        v-for="t in tabs"
        :key="t.id"
        :class="['cf-tearoff__tab', t.id === activeId && 'is-active']"
        role="tab"
        :aria-selected="t.id === activeId"
        :draggable="false"
        @click="setActive(t.id)"
        @pointerdown="(e) => onPointerDown(t, e)"
        @pointermove="(e) => onPointerMove(t, e)"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <span class="cf-tearoff__title">{{ t.title }}</span>
        <span v-if="t.modified" class="cf-tearoff__dirty" aria-label="未保存">●</span>
        <button
          v-if="t.closable"
          type="button"
          class="cf-tearoff__close"
          aria-label="关闭"
          @click.stop="close(t)"
        >×</button>
      </div>
    </div>
    <div class="cf-tearoff__body">
      <template v-for="t in tabs" :key="t.id">
        <div v-if="t.id === activeId" class="cf-tearoff__panel">
          <slot :name="`content-${t.contentKey ?? t.id}`" />
        </div>
      </template>
    </div>
  </div>
</template>
