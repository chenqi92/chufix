<script setup lang="ts">
import { computed } from 'vue';
import {
  KIND_ICON_PATH,
  KIND_LABEL,
  type ArtifactCardProps,
} from './variants';

const props = withDefaults(defineProps<ArtifactCardProps>(), {
  actions: () => ({ copy: true, download: true, open: true }),
});

const emit = defineEmits<{
  (e: 'copy'): void;
  (e: 'download'): void;
  (e: 'open'): void;
}>();

const iconPath = computed(() => KIND_ICON_PATH[props.kind]);
const kindLabel = computed(() => props.kindLabel ?? KIND_LABEL[props.kind]);

async function onCopy() {
  if (props.content && typeof navigator !== 'undefined' && navigator.clipboard) {
    try { await navigator.clipboard.writeText(props.content); } catch { /* ignore */ }
  }
  emit('copy');
}

function onDownload() {
  if (!props.content || typeof window === 'undefined') {
    emit('download');
    return;
  }
  const mime = props.kind === 'svg' ? 'image/svg+xml'
    : props.kind === 'html' ? 'text/html'
    : props.kind === 'json' ? 'application/json'
    : props.kind === 'csv' ? 'text/csv'
    : 'text/plain';
  const blob = new Blob([props.content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = props.filename ?? `${props.title || 'artifact'}${guessExt(props.kind, props.language)}`;
  a.click();
  URL.revokeObjectURL(url);
  emit('download');
}

function guessExt(kind: string, lang?: string): string {
  if (lang) return `.${lang}`;
  if (kind === 'svg') return '.svg';
  if (kind === 'html') return '.html';
  if (kind === 'json') return '.json';
  if (kind === 'csv') return '.csv';
  if (kind === 'code') return '.txt';
  return '.txt';
}

function onOpen() {
  emit('open');
}
</script>

<template>
  <article :class="['cf-artifact', `cf-artifact--${kind}`]">
    <header class="cf-artifact__head">
      <span class="cf-artifact__kind" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path :d="iconPath" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <div class="cf-artifact__title-block">
        <span class="cf-artifact__title">{{ title }}</span>
        <span class="cf-artifact__meta">
          <span class="cf-artifact__kind-label">{{ kindLabel }}</span>
          <span v-if="language" class="cf-artifact__lang">{{ language }}</span>
          <span v-if="meta" class="cf-artifact__meta-extra">{{ meta }}</span>
        </span>
      </div>
      <div class="cf-artifact__actions">
        <button
          v-if="actions.copy && content"
          type="button"
          class="cf-artifact__action"
          aria-label="复制"
          @click="onCopy"
        >
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M5 1h6a2 2 0 012 2v8H5a2 2 0 01-2-2V3a2 2 0 012-2zm0 14h6a2 2 0 002-2V11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
        </button>
        <button
          v-if="actions.download && content"
          type="button"
          class="cf-artifact__action"
          aria-label="下载"
          @click="onDownload"
        >
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v8M4 8l4 4 4-4M3 14h10" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button
          v-if="actions.open"
          type="button"
          class="cf-artifact__action"
          aria-label="展开"
          @click="onOpen"
        >
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M9 2h5v5M14 2L8 8M7 14H2V9M2 14l6-6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </header>
    <div class="cf-artifact__preview">
      <slot />
    </div>
  </article>
</template>
