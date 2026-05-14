<script setup lang="ts">
import { ref } from 'vue';
import type { CitationMarkProps } from './variants';

const props = withDefaults(defineProps<CitationMarkProps>(), {
  disableHover: false,
});

const open = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

function show() {
  if (props.disableHover) return;
  if (timer) clearTimeout(timer);
  open.value = true;
}
function hide() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => (open.value = false), 120);
}
function onClick() {
  if (props.source.url && typeof window !== 'undefined') {
    window.open(props.source.url, '_blank', 'noopener,noreferrer');
  }
}
</script>

<template>
  <sup
    class="cf-citation"
    :class="open && 'is-open'"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <button
      type="button"
      class="cf-citation__mark"
      :aria-label="`引用 ${index}：${source.title}`"
      @click="onClick"
    >{{ index }}</button>
    <span v-if="open && !disableHover" class="cf-citation__card" role="tooltip">
      <span class="cf-citation__card-head">
        <img v-if="source.favicon" :src="source.favicon" alt="" class="cf-citation__favicon" />
        <span class="cf-citation__title">{{ source.title }}</span>
      </span>
      <span v-if="source.domain" class="cf-citation__domain">{{ source.domain }}</span>
      <span v-if="source.snippet" class="cf-citation__snippet">{{ source.snippet }}</span>
      <a
        v-if="source.url"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="cf-citation__link"
      >打开来源 →</a>
    </span>
  </sup>
</template>
