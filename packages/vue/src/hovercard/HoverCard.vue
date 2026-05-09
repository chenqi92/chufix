<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import type { HoverCardProps } from './variants';

const props = withDefaults(defineProps<HoverCardProps>(), {
  placement: 'bottom',
  size: 'md',
  openDelay: 700,
  closeDelay: 200,
  disabled: false,
  to: 'body',
});

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLDivElement | null>(null);
const pos = ref<{ top: number; left: number }>({ top: 0, left: 0 });
let openTimer: number | null = null;
let closeTimer: number | null = null;

const cardClass = computed(() => [
  'cf-hovercard',
  `cf-hovercard--${props.placement}`,
  `cf-hovercard--${props.size}`,
]);

const cardStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
}));

function clearTimers() {
  if (openTimer != null) {
    window.clearTimeout(openTimer);
    openTimer = null;
  }
  if (closeTimer != null) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function reposition() {
  const el = triggerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const card = cardRef.value;
  const cw = card?.offsetWidth ?? 280;
  const ch = card?.offsetHeight ?? 120;
  const gap = 8;
  let top = 0,
    left = 0;
  switch (props.placement) {
    case 'top':
      top = rect.top - ch - gap + window.scrollY;
      left = rect.left + rect.width / 2 - cw / 2 + window.scrollX;
      break;
    case 'bottom':
      top = rect.bottom + gap + window.scrollY;
      left = rect.left + rect.width / 2 - cw / 2 + window.scrollX;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - ch / 2 + window.scrollY;
      left = rect.left - cw - gap + window.scrollX;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - ch / 2 + window.scrollY;
      left = rect.right + gap + window.scrollX;
      break;
  }
  pos.value = { top, left };
}

function show() {
  if (props.disabled) return;
  clearTimers();
  openTimer = window.setTimeout(async () => {
    open.value = true;
    await nextTick();
    reposition();
  }, props.openDelay);
}

function hide() {
  clearTimers();
  closeTimer = window.setTimeout(() => {
    open.value = false;
  }, props.closeDelay);
}

function onCardEnter() {
  clearTimers();
}

function onCardLeave() {
  hide();
}

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <span
    ref="triggerRef"
    class="cf-hovercard__trigger"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
  </span>
  <Teleport :to="to">
    <div
      v-if="open"
      ref="cardRef"
      :class="cardClass"
      :style="cardStyle"
      role="dialog"
      @mouseenter="onCardEnter"
      @mouseleave="onCardLeave"
    >
      <slot name="content" />
    </div>
  </Teleport>
</template>
