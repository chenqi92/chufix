<script setup lang="ts">
import { computed, ref } from 'vue';
import { typeOf, type JsonValueType } from './variants';

const props = defineProps<{
  data: unknown;
  name?: string;
  depth: number;
  defaultExpandDepth: number;
  showTypes: boolean;
}>();

const t = computed<JsonValueType>(() => typeOf(props.data));
const isContainer = computed(() => t.value === 'object' || t.value === 'array');
const open = ref(props.depth < props.defaultExpandDepth);

const entries = computed<Array<[string, unknown]>>(() => {
  if (t.value === 'array') {
    return (props.data as unknown[]).map((v, i) => [String(i), v]);
  }
  if (t.value === 'object') {
    return Object.entries(props.data as Record<string, unknown>);
  }
  return [];
});

const summary = computed(() => {
  if (t.value === 'array') return `[${(props.data as unknown[]).length}]`;
  if (t.value === 'object')
    return `{${Object.keys(props.data as Record<string, unknown>).length}}`;
  return '';
});

function toggle() { open.value = !open.value; }
</script>

<template>
  <div class="cf-json__node">
    <div class="cf-json__line" :style="{ paddingInlineStart: `${depth * 16}px` }">
      <button
        v-if="isContainer"
        type="button"
        class="cf-json__caret"
        :class="open && 'is-open'"
        @click="toggle"
        :aria-label="open ? '折叠' : '展开'"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span v-else class="cf-json__caret cf-json__caret--leaf" aria-hidden="true" />

      <span v-if="name !== undefined" class="cf-json__key">{{ name }}</span>
      <span v-if="name !== undefined" class="cf-json__sep">:</span>

      <template v-if="!isContainer">
        <span :class="`cf-json__value cf-json__value--${t}`">
          <template v-if="t === 'string'">"{{ data }}"</template>
          <template v-else-if="t === 'null'">null</template>
          <template v-else-if="t === 'undefined'">undefined</template>
          <template v-else>{{ data }}</template>
        </span>
        <span v-if="showTypes" class="cf-json__type">{{ t }}</span>
      </template>
      <template v-else>
        <span class="cf-json__bracket">{{ t === 'array' ? '[' : '{' }}</span>
        <span v-if="!open" class="cf-json__summary">{{ summary }}</span>
        <span v-if="!open" class="cf-json__bracket">{{ t === 'array' ? ']' : '}' }}</span>
      </template>
    </div>

    <div v-if="isContainer && open" class="cf-json__children">
      <JsonNode
        v-for="[key, val] in entries"
        :key="key"
        :data="val"
        :name="t === 'array' ? undefined : key"
        :depth="depth + 1"
        :default-expand-depth="defaultExpandDepth"
        :show-types="showTypes"
      />
      <div
        class="cf-json__line cf-json__line--close"
        :style="{ paddingInlineStart: `${depth * 16}px` }"
      >
        <span class="cf-json__caret cf-json__caret--leaf" aria-hidden="true" />
        <span class="cf-json__bracket">{{ t === 'array' ? ']' : '}' }}</span>
      </div>
    </div>
  </div>
</template>
