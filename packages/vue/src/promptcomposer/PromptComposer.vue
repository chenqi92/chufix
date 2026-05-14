<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  detectTrigger,
  formatBytes,
  isMentionMatch,
  isSlashMatch,
  type MentionItem,
  type PromptAttachment,
  type PromptComposerProps,
  type SlashCommand,
} from './variants';

const props = withDefaults(defineProps<PromptComposerProps>(), {
  placeholder: '输入消息，Shift+Enter 换行...',
  disabled: false,
  loading: false,
  maxRows: 8,
  submitKey: 'enter',
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'submit', text: string): void;
  (e: 'stop'): void;
  (e: 'attach-add', file: File): void;
  (e: 'attach-remove', id: string): void;
  (e: 'mention', item: MentionItem): void;
  (e: 'slash', cmd: SlashCommand): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const localValue = ref(props.modelValue ?? '');
const caret = ref(0);
const popupIndex = ref(0);

watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined && v !== localValue.value) localValue.value = v;
  },
);

function onInput(e: Event) {
  const ta = e.target as HTMLTextAreaElement;
  localValue.value = ta.value;
  caret.value = ta.selectionStart ?? ta.value.length;
  popupIndex.value = 0;
  emit('update:modelValue', ta.value);
  autosize();
}

function autosize() {
  const ta = textareaRef.value;
  if (!ta) return;
  ta.style.height = 'auto';
  const max = props.maxRows * 22 + 16;
  ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
}

watch(localValue, () => nextTick(autosize), { immediate: true });

const trigger = computed(() => detectTrigger(localValue.value, caret.value));

const filteredSlash = computed<SlashCommand[]>(() => {
  if (!trigger.value || trigger.value.trigger !== '/') return [];
  return (props.slashCommands ?? []).filter((c) => isSlashMatch(c, trigger.value!.query));
});

const filteredMentions = computed<MentionItem[]>(() => {
  if (!trigger.value || trigger.value.trigger !== '@') return [];
  return (props.mentions ?? []).filter((m) => isMentionMatch(m, trigger.value!.query));
});

const popupOpen = computed(() => filteredSlash.value.length > 0 || filteredMentions.value.length > 0);

function chooseSlash(cmd: SlashCommand) {
  if (!trigger.value || trigger.value.trigger !== '/') return;
  applyChoice('/' + cmd.id + ' ', trigger.value.query.length + 1);
  emit('slash', cmd);
}

function chooseMention(m: MentionItem) {
  if (!trigger.value || trigger.value.trigger !== '@') return;
  applyChoice('@' + m.label + ' ', trigger.value.query.length + 1);
  emit('mention', m);
}

function applyChoice(replacement: string, dropLen: number) {
  const before = localValue.value.slice(0, caret.value - dropLen);
  const after = localValue.value.slice(caret.value);
  const next = before + replacement + after;
  localValue.value = next;
  emit('update:modelValue', next);
  nextTick(() => {
    const ta = textareaRef.value;
    if (!ta) return;
    const pos = (before + replacement).length;
    ta.focus();
    ta.setSelectionRange(pos, pos);
    caret.value = pos;
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (popupOpen.value) {
    const items = filteredSlash.value.length > 0 ? filteredSlash.value : filteredMentions.value;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      popupIndex.value = (popupIndex.value + 1) % items.length;
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      popupIndex.value = (popupIndex.value - 1 + items.length) % items.length;
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      caret.value = -1; // hide popup until next input
      return;
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const pick = items[popupIndex.value];
      if (filteredSlash.value.length > 0) chooseSlash(pick as SlashCommand);
      else chooseMention(pick as MentionItem);
      return;
    }
  }

  const isMod = e.ctrlKey || e.metaKey;
  if (e.key === 'Enter') {
    const wantsMod = props.submitKey === 'mod-enter';
    const submit = (wantsMod && isMod) || (!wantsMod && !e.shiftKey && !isMod);
    if (submit) {
      e.preventDefault();
      doSubmit();
    }
  }
}

function doSubmit() {
  if (props.disabled || props.loading) return;
  const text = localValue.value.trim();
  if (!text && (!props.attachments || props.attachments.length === 0)) return;
  emit('submit', localValue.value);
}

function onSelect() {
  const ta = textareaRef.value;
  if (!ta) return;
  caret.value = ta.selectionStart ?? caret.value;
}

function onPickFiles() {
  fileInputRef.value?.click();
}

function onFiles(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? []);
  for (const f of files) emit('attach-add', f);
  if (fileInputRef.value) fileInputRef.value.value = '';
}

function removeAttach(id: string) {
  emit('attach-remove', id);
}

function submitHint(): string {
  return props.submitKey === 'mod-enter' ? '⌘/Ctrl + Enter 发送' : 'Enter 发送 · Shift+Enter 换行';
}
</script>

<template>
  <div :class="['cf-prompt', loading && 'is-loading', disabled && 'is-disabled']">
    <div v-if="attachments && attachments.length" class="cf-prompt__attachments">
      <span v-for="att in attachments" :key="att.id" class="cf-prompt__attachment">
        <img v-if="att.thumbnailUrl" :src="att.thumbnailUrl" alt="" class="cf-prompt__attachment-thumb" />
        <span class="cf-prompt__attachment-info">
          <span class="cf-prompt__attachment-name">{{ att.name }}</span>
          <span v-if="att.size" class="cf-prompt__attachment-size">{{ formatBytes(att.size) }}</span>
        </span>
        <button type="button" class="cf-prompt__attachment-remove" aria-label="移除" @click="removeAttach(att.id)">×</button>
      </span>
    </div>
    <div class="cf-prompt__editor">
      <textarea
        ref="textareaRef"
        :value="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        rows="1"
        class="cf-prompt__textarea"
        @input="onInput"
        @keydown="onKeyDown"
        @select="onSelect"
        @click="onSelect"
        @focus="onSelect"
      />
      <div v-if="popupOpen" class="cf-prompt__popup" role="listbox">
        <button
          v-for="(item, i) in filteredSlash.length ? filteredSlash : filteredMentions"
          :key="item.id"
          type="button"
          role="option"
          :aria-selected="i === popupIndex"
          :class="['cf-prompt__popup-item', i === popupIndex && 'is-active']"
          @mouseenter="popupIndex = i"
          @mousedown.prevent="filteredSlash.length ? chooseSlash(item as SlashCommand) : chooseMention(item as MentionItem)"
        >
          <span class="cf-prompt__popup-label">
            <span class="cf-prompt__popup-trigger">{{ filteredSlash.length ? '/' : '@' }}</span>{{ item.label }}
          </span>
          <span v-if="(item as any).description" class="cf-prompt__popup-desc">{{ (item as any).description }}</span>
        </button>
      </div>
    </div>
    <div class="cf-prompt__toolbar">
      <div class="cf-prompt__toolbar-left">
        <slot name="toolbar">
          <button
            type="button"
            class="cf-prompt__icon-btn"
            aria-label="附件"
            :disabled="disabled || loading"
            @click="onPickFiles"
          >
            <svg viewBox="0 0 16 16" width="14" height="14"><path d="M11 4l-5 5a2 2 0 102.8 2.8l5-5a3 3 0 10-4.2-4.2L4.6 7.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <input ref="fileInputRef" type="file" multiple class="cf-prompt__file-input" @change="onFiles" />
        </slot>
      </div>
      <div class="cf-prompt__toolbar-right">
        <span class="cf-prompt__hint">{{ submitHint() }}</span>
        <button
          v-if="loading"
          type="button"
          class="cf-prompt__send is-stop"
          aria-label="停止"
          @click="emit('stop')"
        >
          <svg viewBox="0 0 16 16" width="14" height="14"><rect x="4" y="4" width="8" height="8" fill="currentColor" /></svg>
        </button>
        <button
          v-else
          type="button"
          class="cf-prompt__send"
          aria-label="发送"
          :disabled="disabled"
          @click="doSubmit"
        >
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 14l12-6L2 2l2 5 6 1-6 1z" fill="currentColor" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
