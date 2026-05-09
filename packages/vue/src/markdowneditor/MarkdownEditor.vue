<script setup lang="ts">
import { computed } from 'vue';
import {
  renderMarkdown,
  type MarkdownEditorProps,
} from './variants';

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
  modelValue: '',
  size: 'md',
  mode: 'split',
  placeholder: '在此输入 Markdown…',
  rows: 14,
  readOnly: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:mode', value: 'split' | 'edit' | 'preview'): void;
}>();

const html = computed(() =>
  props.render ? props.render(props.modelValue) : renderMarkdown(props.modelValue),
);

const cls = computed(() => [
  'cf-md',
  `cf-md--${props.size}`,
  `cf-md--${props.mode}`,
  props.readOnly && 'is-readonly',
]);

function setMode(m: 'split' | 'edit' | 'preview') {
  emit('update:mode', m);
}

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
}
</script>

<template>
  <div :class="cls">
    <div class="cf-md__toolbar" role="toolbar" aria-label="Markdown 视图模式">
      <button
        type="button"
        class="cf-md__btn"
        :aria-pressed="mode === 'edit'"
        @click="setMode('edit')"
      >
        编辑
      </button>
      <button
        type="button"
        class="cf-md__btn"
        :aria-pressed="mode === 'split'"
        @click="setMode('split')"
      >
        分屏
      </button>
      <button
        type="button"
        class="cf-md__btn"
        :aria-pressed="mode === 'preview'"
        @click="setMode('preview')"
      >
        预览
      </button>
    </div>
    <div class="cf-md__body">
      <textarea
        v-if="mode !== 'preview'"
        class="cf-md__edit"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :readonly="readOnly"
        spellcheck="false"
        @input="onInput"
      />
      <div
        v-if="mode !== 'edit'"
        class="cf-md__preview cf-prose"
        v-html="html"
      />
    </div>
  </div>
</template>
