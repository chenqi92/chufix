<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { toastStore, type ToastItem } from './store';

interface ToasterProps {
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';
  teleport?: boolean;
}

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'top-right',
  teleport: true,
});

const items = ref<ToastItem[]>([]);
const canRender = ref(false);
const timers = new Map<string, ReturnType<typeof setTimeout>>();

let unsub: (() => void) | null = null;

function scheduleAutoDismiss(item: ToastItem) {
  if (timers.has(item.id)) return;
  if (item.duration <= 0) return;
  const t = setTimeout(() => {
    timers.delete(item.id);
    toastStore.dismiss(item.id);
  }, item.duration);
  timers.set(item.id, t);
}

function clearTimer(id: string) {
  const t = timers.get(id);
  if (t) {
    clearTimeout(t);
    timers.delete(id);
  }
}

onMounted(() => {
  canRender.value = true;
  unsub = toastStore.subscribe((next) => {
    next.forEach(scheduleAutoDismiss);
    const live = new Set(next.map((x) => x.id));
    timers.forEach((_, id) => {
      if (!live.has(id)) clearTimer(id);
    });
    items.value = next;
  });
});

onBeforeUnmount(() => {
  unsub?.();
  timers.forEach((t) => clearTimeout(t));
  timers.clear();
});

function dismiss(id: string) {
  toastStore.dismiss(id);
}
</script>

<template>
  <div class="cf-toaster-host">
    <Teleport v-if="canRender" to="body" :disabled="!props.teleport">
      <div :class="`cf-toaster cf-toaster--${props.position}`" role="region" aria-label="通知">
        <TransitionGroup name="cf-toast" tag="div" class="cf-toaster__list">
          <div
            v-for="item in items"
            :key="item.id"
            :class="['cf-toast', `cf-toast--${item.type}`]"
            role="status"
          >
            <span class="cf-toast__icon" aria-hidden="true">
              <svg v-if="item.type === 'success'" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="item.type === 'error'" viewBox="0 0 16 16" fill="none">
                <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <svg v-else-if="item.type === 'warning'" viewBox="0 0 16 16" fill="none">
                <path d="M8 4v5M8 12v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <svg v-else-if="item.type === 'info'" viewBox="0 0 16 16" fill="none">
                <path d="M8 7v5M8 4.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <div class="cf-toast__body">
              <div v-if="item.title" class="cf-toast__title">{{ item.title }}</div>
              <div v-if="item.description" class="cf-toast__desc">{{ item.description }}</div>
            </div>
            <button
              v-if="item.dismissible"
              type="button"
              class="cf-toast__close"
              aria-label="关闭"
              @click="dismiss(item.id)"
            >×</button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>
