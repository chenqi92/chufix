<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  trapFocus,
  lockBodyScroll,
  unlockBodyScroll,
  type FocusTrap,
} from '../modal/dom';
import {
  pushDrawer,
  topMostDrawerCloseFn,
  toneClass,
  DRAWER_TONE_ICON_PATH,
  type DrawerProps,
  type DrawerTone,
} from './variants';

const props = withDefaults(defineProps<DrawerProps>(), {
  open: false,
  placement: 'right',
  size: 'md',
  tone: 'default',
  closeOnOverlay: true,
  closeOnEsc: true,
  showClose: true,
  resizable: false,
  mask: true,
  footerAlign: 'end',
  okVariant: 'primary',
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'close'): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();

const panelRef = ref<HTMLDivElement | null>(null);
let trap: FocusTrap | null = null;
let stackEntry: { zIndex: number; release: () => void } | null = null;

const computedZ = ref<number>(props.zIndex ?? 1500);
const sizeOverride = ref<{ width?: number; height?: number }>({});
const okLoading = ref(false);

function close() {
  if (okLoading.value) return;
  emit('update:open', false);
  emit('close');
}

function onOverlayClick(e: MouseEvent) {
  if (!props.closeOnOverlay) return;
  if (okLoading.value) return;
  if (e.target === e.currentTarget) close();
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc) {
    if (topMostDrawerCloseFn() === close) {
      e.stopPropagation();
      close();
    }
  }
}

async function onOk() {
  if (props.onBeforeOk) {
    okLoading.value = true;
    try {
      const r = await props.onBeforeOk();
      if (r === false) return;
    } catch {
      return;
    } finally {
      okLoading.value = false;
    }
  }
  emit('ok');
  emit('update:open', false);
  emit('close');
}

function onCancel() {
  if (okLoading.value) return;
  emit('cancel');
  close();
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      if (props.mask) lockBodyScroll();
      stackEntry = pushDrawer(close);
      computedZ.value = props.zIndex ?? stackEntry.zIndex;
      sizeOverride.value = {};
      okLoading.value = false;
      await nextTick();
      if (panelRef.value) trap = trapFocus(panelRef.value);
      if (typeof window !== 'undefined') window.addEventListener('keydown', onKeyDown, true);
    } else {
      trap?.release();
      trap = null;
      if (props.mask) unlockBodyScroll();
      stackEntry?.release();
      stackEntry = null;
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown, true);
    }
  },
);

onBeforeUnmount(() => {
  if (props.open) {
    trap?.release();
    if (props.mask) unlockBodyScroll();
    stackEntry?.release();
    if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown, true);
  }
});

/* resize from inner edge */
interface ResizeState { startX: number; startY: number; w: number; h: number; }
const resize = ref<ResizeState | null>(null);

function onResizePointerDown(e: PointerEvent) {
  if (!props.resizable || !panelRef.value) return;
  e.preventDefault();
  e.stopPropagation();
  const rect = panelRef.value.getBoundingClientRect();
  resize.value = { startX: e.clientX, startY: e.clientY, w: rect.width, h: rect.height };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}
function onResizePointerMove(e: PointerEvent) {
  if (!resize.value) return;
  const dx = e.clientX - resize.value.startX;
  const dy = e.clientY - resize.value.startY;
  if (props.placement === 'right') {
    sizeOverride.value = { width: Math.max(240, resize.value.w - dx) };
  } else if (props.placement === 'left') {
    sizeOverride.value = { width: Math.max(240, resize.value.w + dx) };
  } else if (props.placement === 'bottom') {
    sizeOverride.value = { height: Math.max(160, resize.value.h - dy) };
  } else {
    sizeOverride.value = { height: Math.max(160, resize.value.h + dy) };
  }
}
function onResizePointerEnd() {
  resize.value = null;
}

/* panel style */
const panelStyle = computed(() => {
  const out: Record<string, string | undefined> = {};
  if (props.placement === 'left' || props.placement === 'right') {
    if (props.width != null) {
      out.maxWidth = typeof props.width === 'number' ? `${props.width}px` : props.width;
      out.width = '100%';
    }
    if (sizeOverride.value.width) {
      out.maxWidth = `${sizeOverride.value.width}px`;
      out.width = '100%';
    }
  } else {
    if (props.height != null) {
      out.maxHeight = typeof props.height === 'number' ? `${props.height}px` : props.height;
      out.height = '100%';
    }
    if (sizeOverride.value.height) {
      out.maxHeight = `${sizeOverride.value.height}px`;
      out.height = '100%';
    }
  }
  return out;
});

const overlayStyle = computed<Record<string, string | undefined>>(() => {
  const out: Record<string, string | undefined> = { zIndex: String(computedZ.value) };
  if (!props.mask) {
    out.background = 'transparent';
    out.pointerEvents = 'none';
  }
  return out;
});

const panelPointer = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {};
  if (!props.mask) out.pointerEvents = 'auto';
  return out;
});

function toneIconPath(t: DrawerTone): string {
  return t === 'default' ? '' : (DRAWER_TONE_ICON_PATH as Record<string, string>)[t];
}

defineExpose({ close, ok: onOk });
</script>

<template>
  <Teleport :to="to">
    <Transition :name="`cf-drawer-${placement}`" appear>
      <div
        v-if="open"
        :class="['cf-drawer__overlay', `cf-drawer__overlay--${placement}`, toneClass(tone), !mask && 'cf-drawer__overlay--no-mask']"
        :style="overlayStyle"
        role="presentation"
        @click="onOverlayClick"
      >
        <div
          ref="panelRef"
          :class="[
            'cf-drawer__panel',
            `cf-drawer__panel--${placement}`,
            `cf-drawer__panel--${size}`,
            resizable && 'is-resizable',
          ]"
          :style="{ ...panelStyle, ...(panelPointer || {}) }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'cf-drawer-title' : undefined"
          :aria-describedby="description ? 'cf-drawer-desc' : undefined"
          tabindex="-1"
        >
          <div
            v-if="title || $slots.header || tone !== 'default'"
            class="cf-drawer__header"
          >
            <span v-if="tone !== 'default'" class="cf-drawer__tone-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20"><path :d="toneIconPath(tone)" fill="currentColor" /></svg>
            </span>
            <div class="cf-drawer__title-block">
              <h2 v-if="title || !$slots.header" id="cf-drawer-title" class="cf-drawer__title">
                <slot name="header">{{ title }}</slot>
              </h2>
              <p v-if="description" id="cf-drawer-desc" class="cf-drawer__desc">{{ description }}</p>
            </div>
          </div>
          <button
            v-if="showClose"
            type="button"
            class="cf-drawer__close"
            aria-label="关闭"
            :disabled="okLoading"
            @click="close"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
          <div class="cf-drawer__body">
            <slot />
          </div>
          <div
            v-if="$slots.footer || okText || cancelText"
            class="cf-drawer__footer"
            :data-align="footerAlign"
          >
            <slot name="footer" :ok="onOk" :cancel="onCancel" :loading="okLoading">
              <button
                v-if="cancelText"
                type="button"
                class="cf-drawer__footer-btn cf-drawer__footer-btn--secondary"
                :disabled="okLoading"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
              <button
                v-if="okText"
                type="button"
                :class="['cf-drawer__footer-btn', `cf-drawer__footer-btn--${tone === 'error' ? 'danger' : okVariant}`, okLoading && 'is-loading']"
                :disabled="okLoading"
                @click="onOk"
              >
                <span v-if="okLoading" class="cf-drawer__footer-spinner" />
                {{ okText }}
              </button>
            </slot>
          </div>
          <span
            v-if="resizable"
            :class="['cf-drawer__resize-handle', `cf-drawer__resize-handle--${placement}`]"
            @pointerdown="onResizePointerDown"
            @pointermove="onResizePointerMove"
            @pointerup="onResizePointerEnd"
            @pointercancel="onResizePointerEnd"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
