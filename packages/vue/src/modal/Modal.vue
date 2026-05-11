<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  trapFocus,
  lockBodyScroll,
  unlockBodyScroll,
  type FocusTrap,
} from './dom';
import {
  pushModal,
  topMostCloseFn,
  toneClass,
  TONE_ICON_PATH,
  type ModalProps,
  type ModalTone,
} from './variants';

const props = withDefaults(defineProps<ModalProps>(), {
  open: false,
  size: 'md',
  tone: 'default',
  closeOnOverlay: true,
  closeOnEsc: true,
  showClose: true,
  centered: true,
  footerAlign: 'end',
  draggable: false,
  resizable: false,
  okVariant: 'primary',
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'close'): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();

const dialogRef = ref<HTMLDivElement | null>(null);
let trap: FocusTrap | null = null;
let stackEntry: { zIndex: number; release: () => void } | null = null;

const computedZ = ref<number>(props.zIndex ?? 1000);
const canRender = ref(false);

const dragOffset = ref({ x: 0, y: 0 });
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
    if (topMostCloseFn() === close) {
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

onMounted(() => {
  canRender.value = true;
});

watch(
  [() => props.open, canRender],
  async ([open, ready]) => {
    if (open && ready) {
      lockBodyScroll();
      stackEntry = pushModal(close);
      computedZ.value = props.zIndex ?? stackEntry.zIndex;
      dragOffset.value = { x: 0, y: 0 };
      sizeOverride.value = {};
      okLoading.value = false;
      await nextTick();
      if (dialogRef.value) trap = trapFocus(dialogRef.value);
      if (typeof window !== 'undefined') window.addEventListener('keydown', onKeyDown, true);
    } else if (!open) {
      trap?.release();
      trap = null;
      unlockBodyScroll();
      stackEntry?.release();
      stackEntry = null;
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown, true);
    }
  },
);

onBeforeUnmount(() => {
  if (props.open) {
    trap?.release();
    unlockBodyScroll();
    stackEntry?.release();
    if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown, true);
  }
});

/* 拖拽 header */
interface DragState { startX: number; startY: number; baseX: number; baseY: number; }
const drag = ref<DragState | null>(null);

function onDragPointerDown(e: PointerEvent) {
  if (!props.draggable) return;
  if ((e.target as HTMLElement).closest('button')) return;
  e.preventDefault();
  drag.value = { startX: e.clientX, startY: e.clientY, baseX: dragOffset.value.x, baseY: dragOffset.value.y };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}
function onDragPointerMove(e: PointerEvent) {
  if (!drag.value) return;
  dragOffset.value = {
    x: drag.value.baseX + (e.clientX - drag.value.startX),
    y: drag.value.baseY + (e.clientY - drag.value.startY),
  };
}
function onDragPointerEnd() {
  drag.value = null;
}

/* 缩放 */
interface ResizeState { startX: number; startY: number; w: number; h: number; }
const resize = ref<ResizeState | null>(null);

function onResizePointerDown(e: PointerEvent) {
  if (!props.resizable || !dialogRef.value) return;
  e.preventDefault();
  e.stopPropagation();
  const rect = dialogRef.value.getBoundingClientRect();
  resize.value = { startX: e.clientX, startY: e.clientY, w: rect.width, h: rect.height };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}
function onResizePointerMove(e: PointerEvent) {
  if (!resize.value) return;
  sizeOverride.value = {
    width: Math.max(280, resize.value.w + (e.clientX - resize.value.startX)),
    height: Math.max(160, resize.value.h + (e.clientY - resize.value.startY)),
  };
}
function onResizePointerEnd() {
  resize.value = null;
}

/* dialog 样式 */
const dialogStyle = computed(() => {
  const out: Record<string, string | undefined> = {};
  if (props.width != null) {
    out.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  if (sizeOverride.value.width) out.width = `${sizeOverride.value.width}px`;
  if (props.minHeight != null) {
    out.minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight;
  }
  if (sizeOverride.value.height) out.height = `${sizeOverride.value.height}px`;
  if (dragOffset.value.x !== 0 || dragOffset.value.y !== 0) {
    out.transform = `translate(${dragOffset.value.x}px, ${dragOffset.value.y}px)`;
  }
  return out;
});

const overlayStyle = computed(() => ({
  zIndex: String(computedZ.value),
  alignItems: props.centered ? 'center' : 'flex-start',
  paddingTop: props.centered ? undefined : '80px',
}));

function toneIconPath(t: ModalTone): string {
  return t === 'default' ? '' : (TONE_ICON_PATH as Record<string, string>)[t];
}

defineExpose({ close, ok: onOk });
</script>

<template>
  <Teleport v-if="canRender" :to="to">
    <Transition name="cf-modal" appear>
      <div
        v-if="open"
        :class="['cf-modal__overlay', toneClass(tone)]"
        :style="overlayStyle"
        role="presentation"
        @click="onOverlayClick"
      >
        <div
          ref="dialogRef"
          :class="['cf-modal__dialog', `cf-modal__dialog--${size}`, draggable && 'is-draggable', resizable && 'is-resizable']"
          :style="dialogStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'cf-modal-title' : undefined"
          :aria-describedby="description ? 'cf-modal-desc' : undefined"
          tabindex="-1"
        >
          <div
            v-if="title || $slots.header || tone !== 'default'"
            class="cf-modal__header"
            @pointerdown="onDragPointerDown"
            @pointermove="onDragPointerMove"
            @pointerup="onDragPointerEnd"
            @pointercancel="onDragPointerEnd"
          >
            <span v-if="tone !== 'default'" class="cf-modal__tone-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20"><path :d="toneIconPath(tone)" fill="currentColor" /></svg>
            </span>
            <div class="cf-modal__title-block">
              <h2 v-if="title || !$slots.header" id="cf-modal-title" class="cf-modal__title">
                <slot name="header">{{ title }}</slot>
              </h2>
              <p v-if="description" id="cf-modal-desc" class="cf-modal__desc">{{ description }}</p>
            </div>
          </div>
          <button
            v-if="showClose"
            type="button"
            class="cf-modal__close"
            aria-label="关闭"
            :disabled="okLoading"
            @click="close"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>

          <div class="cf-modal__body">
            <slot />
          </div>

          <div
            v-if="$slots.footer || okText || cancelText"
            class="cf-modal__footer"
            :data-align="footerAlign"
          >
            <slot name="footer" :ok="onOk" :cancel="onCancel" :loading="okLoading">
              <button
                v-if="cancelText"
                type="button"
                class="cf-modal__footer-btn cf-modal__footer-btn--secondary"
                :disabled="okLoading"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
              <button
                v-if="okText"
                type="button"
                :class="['cf-modal__footer-btn', `cf-modal__footer-btn--${tone === 'error' ? 'danger' : okVariant}`, okLoading && 'is-loading']"
                :disabled="okLoading"
                @click="onOk"
              >
                <span v-if="okLoading" class="cf-modal__footer-spinner" />
                {{ okText }}
              </button>
            </slot>
          </div>

          <span
            v-if="resizable"
            class="cf-modal__resize-handle"
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
