<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  computePopoverPosition,
  type PopoverPlacement,
  type PopoverProps,
} from './variants';

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  placement: 'bottom',
  trigger: 'click',
  offset: 8,
  closeOnOutside: true,
  closeOnEsc: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const triggerRef = ref<HTMLSpanElement | null>(null);
const panelRef = ref<HTMLDivElement | null>(null);

const controlled = computed(() => props.open !== undefined);
const inner = ref(false);
const visible = computed({
  get: () => (controlled.value ? !!props.open : inner.value),
  set: (v) => {
    if (!controlled.value) inner.value = v;
    emit('update:open', v);
  },
});

const pos = ref({ top: 0, left: 0, placement: props.placement as PopoverPlacement });

let hoverOpenTimer: ReturnType<typeof setTimeout> | null = null;
let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

function clearHoverTimers() {
  if (hoverOpenTimer) clearTimeout(hoverOpenTimer);
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
  hoverOpenTimer = null;
  hoverCloseTimer = null;
}

async function reposition() {
  if (!triggerRef.value || !panelRef.value) return;
  const tRect = triggerRef.value.getBoundingClientRect();
  const pw = panelRef.value.offsetWidth;
  const ph = panelRef.value.offsetHeight;
  pos.value = computePopoverPosition(tRect, pw, ph, props.placement, props.offset);
}

async function open() {
  if (props.disabled) return;
  visible.value = true;
  await nextTick();
  reposition();
}

function close() {
  visible.value = false;
}

function toggle() {
  if (visible.value) close();
  else open();
}

function onTriggerClick() {
  if (props.trigger !== 'click') return;
  toggle();
}

function onTriggerEnter() {
  if (props.trigger !== 'hover') return;
  clearHoverTimers();
  hoverOpenTimer = setTimeout(open, 100);
}
function onTriggerLeave() {
  if (props.trigger !== 'hover') return;
  clearHoverTimers();
  hoverCloseTimer = setTimeout(close, 120);
}
function onPanelEnter() {
  if (props.trigger !== 'hover') return;
  clearHoverTimers();
}
function onPanelLeave() {
  if (props.trigger !== 'hover') return;
  clearHoverTimers();
  hoverCloseTimer = setTimeout(close, 120);
}

function onDocumentClick(e: MouseEvent) {
  if (!visible.value) return;
  if (!props.closeOnOutside) return;
  if (props.trigger === 'manual') return;
  const t = e.target as Node | null;
  if (!t) return;
  if (triggerRef.value?.contains(t)) return;
  if (panelRef.value?.contains(t)) return;
  close();
}

function onKeyDown(e: KeyboardEvent) {
  if (!visible.value) return;
  if (e.key === 'Escape' && props.closeOnEsc) {
    close();
  }
}

watch(visible, async (v) => {
  if (v) {
    await nextTick();
    reposition();
    document.addEventListener('mousedown', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
  } else {
    document.removeEventListener('mousedown', onDocumentClick, true);
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
  }
});

onBeforeUnmount(() => {
  clearHoverTimers();
  document.removeEventListener('mousedown', onDocumentClick, true);
  document.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('resize', reposition);
  window.removeEventListener('scroll', reposition, true);
});

const panelStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

const panelClass = computed(
  () => `cf-popover cf-popover--${pos.value.placement}`,
);
</script>

<template>
  <span
    ref="triggerRef"
    class="cf-popover-trigger"
    @click="onTriggerClick"
    @mouseenter="onTriggerEnter"
    @mouseleave="onTriggerLeave"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="cf-popover-fade">
      <div
        v-if="visible"
        ref="panelRef"
        :class="panelClass"
        role="dialog"
        :style="panelStyle"
        @mouseenter="onPanelEnter"
        @mouseleave="onPanelLeave"
      >
        <slot name="content" />
        <span class="cf-popover__arrow" />
      </div>
    </Transition>
  </Teleport>
</template>
