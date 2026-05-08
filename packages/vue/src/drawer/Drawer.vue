<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  trapFocus,
  lockBodyScroll,
  unlockBodyScroll,
  type FocusTrap,
} from '../modal/dom';
import type { DrawerProps } from './variants';

const props = withDefaults(defineProps<DrawerProps>(), {
  open: false,
  placement: 'right',
  size: 'md',
  closeOnOverlay: true,
  closeOnEsc: true,
  showClose: true,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'close'): void;
}>();

const panelRef = ref<HTMLDivElement | null>(null);
let trap: FocusTrap | null = null;

function close() {
  emit('update:open', false);
  emit('close');
}

function onOverlayClick(e: MouseEvent) {
  if (!props.closeOnOverlay) return;
  if (e.target === e.currentTarget) close();
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc) {
    e.stopPropagation();
    close();
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lockBodyScroll();
      await nextTick();
      if (panelRef.value) trap = trapFocus(panelRef.value);
    } else {
      trap?.release();
      trap = null;
      unlockBodyScroll();
    }
  },
);

onBeforeUnmount(() => {
  if (props.open) {
    trap?.release();
    unlockBodyScroll();
  }
});
</script>

<template>
  <Teleport :to="to">
    <Transition :name="`cf-drawer-${placement}`" appear>
      <div
        v-if="open"
        :class="['cf-drawer__overlay', `cf-drawer__overlay--${placement}`]"
        role="presentation"
        @click="onOverlayClick"
        @keydown="onKeyDown"
      >
        <div
          ref="panelRef"
          :class="[
            'cf-drawer__panel',
            `cf-drawer__panel--${placement}`,
            `cf-drawer__panel--${size}`,
          ]"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <div v-if="title || $slots.header" class="cf-drawer__header">
            <slot name="header">{{ title }}</slot>
          </div>
          <button
            v-if="showClose"
            type="button"
            class="cf-drawer__close"
            aria-label="关闭"
            @click="close"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
          <div class="cf-drawer__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="cf-drawer__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
