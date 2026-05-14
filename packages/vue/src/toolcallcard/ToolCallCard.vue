<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  formatDuration,
  safeStringify,
  STATUS_LABEL,
  type ToolCallCardProps,
} from './variants';

const props = withDefaults(defineProps<ToolCallCardProps>(), {
  status: 'success',
  collapsible: true,
  defaultOpen: false,
});

const open = ref(props.defaultOpen);

function toggle() {
  if (!props.collapsible) return;
  open.value = !open.value;
}

const inputStr = computed(() => safeStringify(props.input));
const outputStr = computed(() => (props.errorMessage ? props.errorMessage : safeStringify(props.output)));
const durationStr = computed(() => formatDuration(props.duration));
</script>

<template>
  <article :class="['cf-toolcall', `is-${status}`, open && 'is-open']">
    <header class="cf-toolcall__head">
      <button
        v-if="collapsible"
        type="button"
        class="cf-toolcall__toggle"
        :aria-expanded="open"
        @click="toggle"
      >
        <svg class="cf-toolcall__caret" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="cf-toolcall__icon" aria-hidden="true">
        <svg v-if="status === 'running'" viewBox="0 0 16 16" width="14" height="14" class="cf-toolcall__spinner">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="20 12" />
        </svg>
        <svg v-else-if="status === 'success'" viewBox="0 0 16 16" width="14" height="14">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-.7 9.3L4.5 8l1-1 1.8 1.8L11 5l1 1-4.7 4.8z" fill="currentColor" />
        </svg>
        <svg v-else-if="status === 'error'" viewBox="0 0 16 16" width="14" height="14">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM6 5l2 2 2-2 1 1-2 2 2 2-1 1-2-2-2 2-1-1 2-2-2-2 1-1z" fill="currentColor"/>
        </svg>
        <svg v-else viewBox="0 0 16 16" width="14" height="14">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4" fill="none" />
        </svg>
      </span>
      <span class="cf-toolcall__name">{{ name }}</span>
      <span class="cf-toolcall__status">{{ STATUS_LABEL[status] }}</span>
      <span v-if="durationStr" class="cf-toolcall__duration">{{ durationStr }}</span>
    </header>
    <div v-if="open" class="cf-toolcall__body">
      <div v-if="inputStr" class="cf-toolcall__section">
        <div class="cf-toolcall__section-head">输入</div>
        <pre class="cf-toolcall__pre"><code>{{ inputStr }}</code></pre>
      </div>
      <div v-if="outputStr" class="cf-toolcall__section">
        <div class="cf-toolcall__section-head">{{ status === 'error' ? '错误' : '输出' }}</div>
        <pre :class="['cf-toolcall__pre', status === 'error' && 'is-error']"><code>{{ outputStr }}</code></pre>
      </div>
    </div>
  </article>
</template>
