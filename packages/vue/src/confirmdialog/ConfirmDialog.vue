<script setup lang="ts">
import { computed } from 'vue';
import Modal from '../modal/Modal.vue';
import Button from '../button/Button.vue';
import type { ConfirmDialogProps } from './variants';

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  open: false,
  tone: 'default',
  confirmText: '确认',
  cancelText: '取消',
  loading: false,
  closeOnOverlay: false,
  closeOnEsc: true,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const confirmVariant = computed(() =>
  props.tone === 'danger' ? 'danger' : 'primary',
);

function onConfirm() {
  emit('confirm');
}

function onCancel() {
  emit('update:open', false);
  emit('cancel');
}

function onOpenChange(v: boolean) {
  emit('update:open', v);
  if (!v) emit('cancel');
}
</script>

<template>
  <Modal
    :open="open"
    :title="title"
    size="sm"
    :close-on-overlay="closeOnOverlay"
    :close-on-esc="closeOnEsc"
    @update:open="onOpenChange"
  >
    <div class="cf-confirm">
      <div class="cf-confirm__icon" :data-tone="tone">
        <svg
          v-if="tone === 'danger'"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6" />
          <path
            d="M12 8v4M12 16h.01"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div class="cf-confirm__content">
        <p v-if="description" class="cf-confirm__desc">{{ description }}</p>
        <slot />
      </div>
    </div>
    <template #footer>
      <Button variant="tertiary" :disabled="loading" @click="onCancel">
        {{ cancelText }}
      </Button>
      <Button :variant="confirmVariant" :loading="loading" @click="onConfirm">
        {{ confirmText }}
      </Button>
    </template>
  </Modal>
</template>
