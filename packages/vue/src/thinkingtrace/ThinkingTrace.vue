<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatDuration, type ThinkingTraceProps } from './variants';

const props = withDefaults(defineProps<ThinkingTraceProps>(), {
  defaultOpen: false,
  status: 'thinking',
});

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
}>();

const isControlled = computed(() => typeof props.open === 'boolean');
const internalOpen = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? (props.open as boolean) : internalOpen.value));

watch(
  () => props.status,
  (s) => {
    if (s === 'done' && !isControlled.value) {
      // collapse automatically when finished, unless caller controls it
      internalOpen.value = false;
    }
  },
);

function toggle() {
  const next = !open.value;
  if (!isControlled.value) internalOpen.value = next;
  emit('update:open', next);
}

const labelText = computed(() => {
  if (props.label) return props.label;
  const dur = formatDuration(props.duration);
  if (props.status === 'thinking') return dur ? `思考中 · ${dur}` : '思考中…';
  return dur ? `Thought for ${dur}` : '思考结果';
});
</script>

<template>
  <section :class="['cf-thinking', `is-${status}`, open && 'is-open']">
    <button
      type="button"
      class="cf-thinking__head"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="cf-thinking__icon" aria-hidden="true">
        <svg v-if="status === 'thinking'" viewBox="0 0 16 16" width="14" height="14" class="cf-thinking__icon-spin">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="20 12" />
        </svg>
        <svg v-else viewBox="0 0 16 16" width="14" height="14">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-.7 9.3L4.5 8l1-1 1.8 1.8L11 5l1 1-4.7 4.8z" fill="currentColor"/>
        </svg>
      </span>
      <span class="cf-thinking__label">{{ labelText }}</span>
      <svg class="cf-thinking__caret" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="open" class="cf-thinking__body">
      <slot />
    </div>
  </section>
</template>
