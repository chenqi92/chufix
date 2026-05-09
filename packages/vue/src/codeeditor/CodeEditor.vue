<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  buildLineNumbers,
  lineCount,
  type CodeEditorProps,
} from './variants';

const props = withDefaults(defineProps<CodeEditorProps>(), {
  modelValue: '',
  language: 'plaintext',
  size: 'md',
  showLineNumbers: true,
  readOnly: false,
  placeholder: '',
  rows: 12,
  wrap: false,
  tabSize: 2,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const gutterRef = ref<HTMLDivElement | null>(null);

const lines = computed(() => buildLineNumbers(lineCount(props.modelValue)));

const cls = computed(() => [
  'cf-codeeditor',
  `cf-codeeditor--${props.size}`,
  props.showLineNumbers && 'cf-codeeditor--gutter',
  props.readOnly && 'is-readonly',
  props.wrap && 'is-wrap',
]);

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
}

function onScroll() {
  if (gutterRef.value && textareaRef.value) {
    gutterRef.value.scrollTop = textareaRef.value.scrollTop;
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Tab' && props.tabSize > 0 && !props.readOnly) {
    e.preventDefault();
    const ta = e.target as HTMLTextAreaElement;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const indent = ' '.repeat(props.tabSize);
    const next = ta.value.slice(0, start) + indent + ta.value.slice(end);
    emit('update:modelValue', next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + indent.length;
    });
  }
}
</script>

<template>
  <div :class="cls">
    <div v-if="showLineNumbers" ref="gutterRef" class="cf-codeeditor__gutter">
      <span v-for="n in lines" :key="n">{{ n }}</span>
    </div>
    <textarea
      ref="textareaRef"
      class="cf-codeeditor__input"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readOnly"
      :rows="rows"
      :spellcheck="false"
      :data-language="language"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      @input="onInput"
      @scroll="onScroll"
      @keydown="onKeyDown"
    />
  </div>
</template>
