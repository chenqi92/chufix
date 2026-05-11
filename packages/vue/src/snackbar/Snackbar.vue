<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { snackbarClass, type SnackbarProps } from './variants';

const props = withDefaults(defineProps<SnackbarProps>(), {
  open: false,
  tone: 'default',
  placement: 'bottom-center',
  duration: 5000,
  showDismiss: true,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'action'): void;
  (e: 'dismiss'): void;
}>();

const cls = computed(() =>
  snackbarClass({ tone: props.tone, placement: props.placement }),
);

const canRender = ref(false);
let timer: number | null = null;

function clear() {
  if (timer != null) {
    window.clearTimeout(timer);
    timer = null;
  }
}

function startTimer() {
  clear();
  if (props.duration > 0) {
    timer = window.setTimeout(() => emit('update:open', false), props.duration);
  }
}

onMounted(() => {
  canRender.value = true;
});

watch(
  [() => props.open, canRender],
  ([open, ready]) => {
    if (open && ready) startTimer();
    else clear();
  },
  { immediate: true },
);

watch(
  () => props.duration,
  () => {
    if (props.open) startTimer();
  },
);

function onAction() {
  emit('action');
  emit('update:open', false);
}

function onDismiss() {
  emit('dismiss');
  emit('update:open', false);
}

onBeforeUnmount(clear);
</script>

<template>
  <Teleport v-if="canRender" :to="to">
    <Transition name="cf-snackbar" appear>
      <div v-if="open" :class="cls" role="status" aria-live="polite">
        <span v-if="tone !== 'default'" class="cf-snackbar__icon" aria-hidden="true">
          <svg v-if="tone === 'success'" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4" />
            <path
              d="M5 8.5l2.2 2.2L11 6.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
          <svg v-else-if="tone === 'warning'" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L1.5 13h13z"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
              fill="none"
            />
            <path d="M8 6.5v3M8 11.5h.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          <svg v-else-if="tone === 'error'" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4" />
            <path
              d="M5.5 5.5l5 5M10.5 5.5l-5 5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          <svg v-else viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4" />
            <path
              d="M8 7v4M8 5h.01"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="cf-snackbar__message">
          <slot>{{ message }}</slot>
        </span>
        <template v-if="actionLabel">
          <span class="cf-snackbar__sep" aria-hidden="true" />
          <button
            type="button"
            class="cf-snackbar__action"
            @click="onAction"
          >
            {{ actionLabel }}
            <span v-if="actionShortcut" class="cf-snackbar__shortcut">{{
              actionShortcut
            }}</span>
          </button>
        </template>
        <button
          v-if="showDismiss"
          type="button"
          class="cf-snackbar__dismiss"
          aria-label="关闭"
          @click="onDismiss"
        >
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
