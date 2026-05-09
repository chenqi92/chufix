<script setup lang="ts">
import { computed } from 'vue';
import type { TitleBarProps } from './variants';

const props = withDefaults(defineProps<TitleBarProps>(), {
  platform: 'macos',
  modified: false,
  size: 'md',
  hideControls: false,
});

const emit = defineEmits<{
  (e: 'minimize'): void;
  (e: 'maximize'): void;
  (e: 'close'): void;
}>();

const cls = computed(() => [
  'cf-titlebar',
  `cf-titlebar--${props.platform}`,
  `cf-titlebar--${props.size}`,
]);
</script>

<template>
  <div :class="cls">
    <template v-if="platform === 'macos' && !hideControls">
      <div class="cf-titlebar__traffic" aria-label="window controls">
        <button
          type="button"
          class="cf-titlebar__tl cf-titlebar__tl--close"
          aria-label="关闭"
          @click="emit('close')"
        />
        <button
          type="button"
          class="cf-titlebar__tl cf-titlebar__tl--min"
          aria-label="最小化"
          @click="emit('minimize')"
        />
        <button
          type="button"
          class="cf-titlebar__tl cf-titlebar__tl--max"
          aria-label="最大化"
          @click="emit('maximize')"
        />
      </div>
    </template>

    <div class="cf-titlebar__leading">
      <slot name="leading" />
    </div>

    <div class="cf-titlebar__title">
      <slot name="title">
        <span v-if="title" class="cf-titlebar__doc">{{ title }}</span>
        <template v-if="subtitle">
          <span class="cf-titlebar__sep">—</span>
          <span>{{ subtitle }}</span>
        </template>
        <span v-if="modified" class="cf-titlebar__dot" aria-label="未保存">●</span>
      </slot>
    </div>

    <div class="cf-titlebar__actions">
      <slot name="actions" />
    </div>

    <template
      v-if="(platform === 'windows' || platform === 'linux') && !hideControls"
    >
      <div class="cf-titlebar__winctl">
        <button
          type="button"
          class="cf-titlebar__wc"
          aria-label="最小化"
          @click="emit('minimize')"
        >
          <svg viewBox="0 0 10 10"><path d="M0 5 H10" stroke="currentColor" stroke-width="1"/></svg>
        </button>
        <button
          type="button"
          class="cf-titlebar__wc"
          aria-label="最大化"
          @click="emit('maximize')"
        >
          <svg viewBox="0 0 10 10" fill="none"><rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" stroke-width="1"/></svg>
        </button>
        <button
          type="button"
          class="cf-titlebar__wc cf-titlebar__wc--close"
          aria-label="关闭"
          @click="emit('close')"
        >
          <svg viewBox="0 0 10 10"><path d="M0 0 L10 10 M10 0 L0 10" stroke="currentColor" stroke-width="1"/></svg>
        </button>
      </div>
    </template>
  </div>
</template>
