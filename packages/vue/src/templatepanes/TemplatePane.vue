<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TemplatePaneProps, TemplatePaneTab } from './variants';

const props = withDefaults(
  defineProps<
    TemplatePaneProps & {
      defaultTabs: TemplatePaneTab[];
      paneClass: string;
    }
  >(),
  {
    size: 'md',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const localActive = ref<string>(
  props.modelValue ?? (props.tabs ?? props.defaultTabs)[0].id,
);

const activeId = computed(() => props.modelValue ?? localActive.value);

const tabList = computed(() => props.tabs ?? props.defaultTabs);

function setActive(id: string) {
  localActive.value = id;
  emit('update:modelValue', id);
}

const cls = computed(() => [
  'cf-tplpane',
  `cf-tplpane--${props.size}`,
  props.paneClass,
]);
</script>

<template>
  <div :class="cls">
    <div class="cf-tplpane__bar" role="tablist">
      <button
        v-for="t in tabList"
        :key="t.id"
        type="button"
        :class="['cf-tplpane__tab', t.id === activeId && 'is-active']"
        role="tab"
        :aria-selected="t.id === activeId"
        :disabled="t.disabled"
        @click="setActive(t.id)"
      >
        <span class="cf-tplpane__label">{{ t.label }}</span>
        <span v-if="t.badge" class="cf-tplpane__badge">{{ t.badge }}</span>
      </button>
    </div>
    <div class="cf-tplpane__body">
      <template v-for="t in tabList" :key="t.id">
        <div v-if="t.id === activeId" class="cf-tplpane__panel">
          <slot :name="`panel-${t.id}`" />
        </div>
      </template>
    </div>
  </div>
</template>
