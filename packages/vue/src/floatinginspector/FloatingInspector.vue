<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FloatingInspectorProps } from './variants';

const props = withDefaults(defineProps<FloatingInspectorProps>(), {
  open: true,
  placement: 'bottom-right',
  collapsed: false,
  width: 320,
  offset: 24,
  closable: true,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'update:collapsed', value: boolean): void;
}>();

const localCollapsed = ref(props.collapsed);
watch(
  () => props.collapsed,
  (v) => (localCollapsed.value = v),
);

const cls = computed(() => [
  'cf-inspector',
  `cf-inspector--${props.placement}`,
  localCollapsed.value && 'is-collapsed',
]);

const dim = computed(() => ({
  width:
    typeof props.width === 'number' ? `${props.width}px` : props.width,
  margin: `${props.offset}px`,
}));

function toggle() {
  const next = !localCollapsed.value;
  localCollapsed.value = next;
  emit('update:collapsed', next);
}

function close() {
  emit('update:open', false);
}
</script>

<template>
  <Teleport :to="to">
    <aside v-if="open" :class="cls" :style="dim" role="complementary">
      <header class="cf-inspector__header">
        <button
          type="button"
          class="cf-inspector__toggle"
          :aria-expanded="!localCollapsed"
          @click="toggle"
        >
          <svg viewBox="0 0 12 12" fill="none" :class="['cf-inspector__caret', !localCollapsed && 'is-open']">
            <path d="M3 4l3 3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="cf-inspector__title">
            <slot name="title">{{ title }}</slot>
          </span>
        </button>
        <span class="cf-inspector__actions">
          <slot name="actions" />
          <button
            v-if="closable"
            type="button"
            class="cf-inspector__close"
            aria-label="关闭"
            @click="close"
          >×</button>
        </span>
      </header>
      <div v-if="!localCollapsed" class="cf-inspector__body">
        <slot />
      </div>
    </aside>
  </Teleport>
</template>
