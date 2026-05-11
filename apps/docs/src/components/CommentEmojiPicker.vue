<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfButton } from '@chufix-design/vue';

interface EmojiCategory {
  id: string;
  label: string;
  emojis: string[];
}

const props = withDefaults(defineProps<{
  categories: EmojiCategory[];
  label: string;
  panelLabel: string;
  disabled?: boolean;
}>(), {
  disabled: false,
});

const emit = defineEmits<{
  select: [emoji: string];
}>();

const open = ref(false);
const activeId = ref(props.categories[0]?.id ?? '');
const rootRef = ref<HTMLDivElement | null>(null);
const panelId = `comment-emoji-panel-${Math.random().toString(36).slice(2)}`;
const activeCategory = computed(() =>
  props.categories.find((item) => item.id === activeId.value) ?? props.categories[0],
);

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function selectEmoji(emoji: string) {
  emit('select', emoji);
  close();
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget;
  if (next instanceof Node && rootRef.value?.contains(next)) return;
  close();
}

function onTabKeydown(e: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  let nextIndex = index;
  if (e.key === 'ArrowLeft') nextIndex = (index - 1 + props.categories.length) % props.categories.length;
  if (e.key === 'ArrowRight') nextIndex = (index + 1) % props.categories.length;
  if (e.key === 'Home') nextIndex = 0;
  if (e.key === 'End') nextIndex = props.categories.length - 1;
  activeId.value = props.categories[nextIndex]?.id ?? activeId.value;
}
</script>

<template>
  <div ref="rootRef" class="comment-emoji-picker" @focusout="onFocusOut" @keydown.esc="close">
    <CfButton
      type="button"
      variant="ghost"
      size="sm"
      :disabled="disabled"
      :aria-expanded="open"
      :aria-controls="panelId"
      aria-haspopup="dialog"
      @click="toggle"
    >
      {{ label }}
    </CfButton>

    <div
      v-if="open && activeCategory"
      :id="panelId"
      class="comment-emoji-picker__panel"
      role="dialog"
      :aria-label="panelLabel"
    >
      <div class="comment-emoji-picker__tabs" role="tablist" :aria-label="panelLabel">
        <button
          v-for="(category, index) in categories"
          :key="category.id"
          type="button"
          class="comment-emoji-picker__tab"
          :class="{ 'is-active': category.id === activeId }"
          role="tab"
          :aria-selected="category.id === activeId"
          @click="activeId = category.id"
          @keydown="onTabKeydown($event, index)"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="comment-emoji-picker__grid" role="tabpanel">
        <button
          v-for="emoji in activeCategory.emojis"
          :key="emoji"
          type="button"
          class="comment-emoji-picker__emoji"
          :aria-label="`${label} ${emoji}`"
          @click="selectEmoji(emoji)"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-emoji-picker {
  position: relative;
  display: inline-flex;
}

.comment-emoji-picker__panel {
  position: absolute;
  left: 0;
  bottom: calc(100% + 0.5rem);
  z-index: var(--z-dropdown);
  width: min(20rem, calc(100vw - 2rem));
  padding: 0.5rem;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-1);
  box-shadow: var(--shadow-3);
}

.comment-emoji-picker__tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0.15rem;
  border-radius: var(--r-4);
  background: var(--bg-2);
}

.comment-emoji-picker__tab {
  flex: 1 1 0;
  min-width: 0;
  height: 1.85rem;
  padding: 0 0.5rem;
  border: 0;
  border-radius: var(--r-3);
  background: transparent;
  color: var(--fg-2);
  cursor: pointer;
  font: inherit;
  font-size: var(--t-12);
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}

.comment-emoji-picker__tab:hover,
.comment-emoji-picker__tab.is-active {
  background: var(--bg-1);
  color: var(--fg-1);
}

.comment-emoji-picker__tab:focus-visible,
.comment-emoji-picker__emoji:focus-visible {
  outline: 2px solid var(--accent-1);
  outline-offset: 2px;
}

.comment-emoji-picker__grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0.25rem;
  padding-top: 0.5rem;
}

.comment-emoji-picker__emoji {
  width: 2rem;
  height: 2rem;
  border: 1px solid transparent;
  border-radius: var(--r-3);
  background: transparent;
  cursor: pointer;
  font-size: 1.12rem;
  line-height: 1;
  transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}

.comment-emoji-picker__emoji:hover {
  border-color: var(--line-1);
  background: var(--bg-2);
}

@media (max-width: 520px) {
  .comment-emoji-picker,
  .comment-emoji-picker :deep(.cf-btn) {
    width: 100%;
  }

  .comment-emoji-picker__panel {
    right: 0;
    width: min(100%, calc(100vw - 2rem));
  }
}
</style>
