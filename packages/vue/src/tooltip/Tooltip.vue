<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  computeTooltipPosition,
  type TooltipPlacement,
  type TooltipProps,
} from './variants';

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  delay: 100,
  hideDelay: 80,
  disabled: false,
  offset: 8,
});

const triggerRef = ref<HTMLSpanElement | null>(null);
const tipRef = ref<HTMLDivElement | null>(null);
const visible = ref(false);
const pos = ref({ top: 0, left: 0, placement: props.placement as TooltipPlacement });
const canRender = ref(false);

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
  if (openTimer) clearTimeout(openTimer);
  if (closeTimer) clearTimeout(closeTimer);
  openTimer = null;
  closeTimer = null;
}

async function reposition() {
  if (!triggerRef.value || !tipRef.value) return;
  const tRect = triggerRef.value.getBoundingClientRect();
  const tw = tipRef.value.offsetWidth;
  const th = tipRef.value.offsetHeight;
  pos.value = computeTooltipPosition(tRect, tw, th, props.placement, props.offset);
}

function show() {
  if (props.disabled || !props.content) return;
  clearTimers();
  openTimer = setTimeout(async () => {
    visible.value = true;
    await nextTick();
    reposition();
  }, props.delay);
}

function hide() {
  clearTimers();
  closeTimer = setTimeout(() => {
    visible.value = false;
  }, props.hideDelay);
}

const tipStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
  maxWidth:
    typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
}));

const tipClass = computed(
  () => `cf-tooltip cf-tooltip--${pos.value.placement}`,
);

onMounted(() => {
  canRender.value = true;
});

onBeforeUnmount(clearTimers);
</script>

<template>
  <span
    ref="triggerRef"
    class="cf-tooltip-trigger"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
  </span>
  <Teleport v-if="canRender" to="body">
    <Transition name="cf-tooltip-fade">
      <div
        v-if="visible"
        ref="tipRef"
        :class="tipClass"
        role="tooltip"
        :style="tipStyle"
      >
        <slot name="content">{{ content }}</slot>
        <span class="cf-tooltip__arrow" />
      </div>
    </Transition>
  </Teleport>
</template>
