<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  codeBlockClass,
  escapeHtml,
  highlightCode,
  normalizeCodeIndent,
  type CodeBlockProps,
} from './variants';

const props = withDefaults(defineProps<CodeBlockProps>(), {
  size: 'md',
  showLineNumbers: false,
  copyable: true,
  startLine: 1,
  wrap: false,
  tone: 'light',
  trimIndent: false,
  highlight: true,
});

const cls = computed(() =>
  codeBlockClass({
    size: props.size,
    showLineNumbers: props.showLineNumbers,
    wrap: props.wrap,
    tone: props.tone,
    className: props.className,
  }),
);

const displayCode = computed(() =>
  props.trimIndent ? normalizeCodeIndent(props.code) : props.code,
);

const lines = computed(() => displayCode.value.split('\n'));
const highlighted = computed(() => {
  if (props.highlightedHtml) return props.highlightedHtml;
  if (props.highlight === false) return escapeHtml(displayCode.value);
  return highlightCode(props.code, props.language, props.trimIndent);
});

const copyState = ref<'idle' | 'copied'>('idle');

async function copy() {
  try {
    await navigator.clipboard.writeText(displayCode.value);
    copyState.value = 'copied';
    setTimeout(() => (copyState.value = 'idle'), 1500);
  } catch (e) {
    /* swallow */
  }
}

const maxHeightStyle = computed(() => {
  if (props.maxHeight == null) return undefined;
  return {
    maxHeight:
      typeof props.maxHeight === 'number'
        ? `${props.maxHeight}px`
        : props.maxHeight,
  };
});
</script>

<template>
  <div :class="cls">
    <header v-if="title || language || copyable" class="cf-code-block__header">
      <span v-if="title" class="cf-code-block__title">{{ title }}</span>
      <span v-if="language" class="cf-code-block__lang">{{ language }}</span>
      <button
        v-if="copyable"
        type="button"
        class="cf-code-block__copy"
        :aria-label="copyState === 'copied' ? '已复制' : '复制代码'"
        @click="copy"
      >
        <span v-if="copyState === 'copied'">已复制</span>
        <span v-else>复制</span>
      </button>
    </header>
    <pre class="cf-code-block__pre" :style="maxHeightStyle">
      <template v-if="showLineNumbers">
        <span class="cf-code-block__nums" aria-hidden="true">
          <span v-for="(_, i) in lines" :key="i">{{ startLine + i }}</span>
        </span>
      </template>
      <code class="cf-code-block__code" v-html="highlighted"></code>
    </pre>
  </div>
</template>
