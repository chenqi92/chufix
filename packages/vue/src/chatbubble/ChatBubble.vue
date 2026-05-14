<script setup lang="ts">
import { computed } from 'vue';
import {
  alignFromRole,
  formatTimestamp,
  resolveInitials,
  type ChatBubbleProps,
} from './variants';

const props = withDefaults(defineProps<ChatBubbleProps>(), {
  state: 'sent',
  showCopy: true,
  showActions: true,
  align: 'auto',
});

const emit = defineEmits<{
  (e: 'copy'): void;
  (e: 'retry'): void;
  (e: 'edit'): void;
  (e: 'branch'): void;
  (e: 'action', name: string): void;
}>();

const align = computed(() => alignFromRole(props.role, props.align));
const time = computed(() => formatTimestamp(props.timestamp));
const initials = computed(() => resolveInitials(props.author, props.role));

async function onCopy() {
  if (!props.content && typeof navigator !== 'undefined' && navigator.clipboard) {
    return;
  }
  try {
    if (props.content) await navigator.clipboard.writeText(props.content);
  } catch {
    /* clipboard blocked */
  }
  emit('copy');
  emit('action', 'copy');
}

function onRetry() {
  emit('retry');
  emit('action', 'retry');
}
function onEdit() {
  emit('edit');
  emit('action', 'edit');
}
function onBranch() {
  emit('branch');
  emit('action', 'branch');
}
</script>

<template>
  <div
    :class="[
      'cf-chatbubble',
      `cf-chatbubble--${role}`,
      `cf-chatbubble--align-${align}`,
      `cf-chatbubble--state-${state}`,
    ]"
    :data-state="state"
  >
    <div class="cf-chatbubble__avatar" aria-hidden="true">
      <img v-if="author?.avatar" :src="author.avatar" :alt="author.name ?? ''" />
      <span v-else class="cf-chatbubble__initials">{{ initials }}</span>
    </div>
    <div class="cf-chatbubble__main">
      <div class="cf-chatbubble__meta" v-if="author?.name || time">
        <span v-if="author?.name" class="cf-chatbubble__name">{{ author?.name }}</span>
        <span v-if="time" class="cf-chatbubble__time">{{ time }}</span>
      </div>
      <div class="cf-chatbubble__body" :data-role="role">
        <slot>{{ content }}</slot>
        <span v-if="state === 'streaming'" class="cf-chatbubble__cursor" aria-hidden="true" />
      </div>
      <div v-if="state === 'error'" class="cf-chatbubble__error">
        消息发送失败。
        <button v-if="showActions" type="button" class="cf-chatbubble__error-retry" @click="onRetry">重试</button>
      </div>
      <div v-if="showActions || showCopy" class="cf-chatbubble__actions">
        <button v-if="showCopy" type="button" class="cf-chatbubble__action" aria-label="复制" @click="onCopy">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M5 1h6a2 2 0 012 2v8H5a2 2 0 01-2-2V3a2 2 0 012-2zm0 14h6a2 2 0 002-2V11H5a2 2 0 00-2 2v0a2 2 0 002 2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
          复制
        </button>
        <button v-if="showActions && role === 'assistant' && state !== 'streaming'" type="button" class="cf-chatbubble__action" aria-label="重试" @click="onRetry">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8a5 5 0 019-3l1 1V3M13 8a5 5 0 01-9 3l-1-1v3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          重试
        </button>
        <button v-if="showActions && role === 'user'" type="button" class="cf-chatbubble__action" aria-label="编辑" @click="onEdit">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 12l2-1 7-7 1 2-1 1-7 7-2-2zM12 4l2-2 1 1-2 2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
          编辑
        </button>
        <button v-if="showActions" type="button" class="cf-chatbubble__action" aria-label="分支" @click="onBranch">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 3v6m0 4a2 2 0 100-4 2 2 0 000 4zm0-8a1 1 0 110-2 1 1 0 010 2zm8 0v6a3 3 0 01-3 3H6m6-9a1 1 0 110-2 1 1 0 010 2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
          分支
        </button>
      </div>
    </div>
  </div>
</template>
