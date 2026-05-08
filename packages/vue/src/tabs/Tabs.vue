<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue';
import {
  type TabsItem,
  type TabsProps,
  tabsClass,
} from './variants';

const props = withDefaults(defineProps<TabsProps>(), {
  variant: 'line',
  size: 'md',
  align: 'start',
});
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: string): void;
}>();

const slots = useSlots();

/* derive tab list from items prop OR from <Tab> child slot vnodes  */
const fallback = computed<TabsItem[]>(() => {
  if (props.items && props.items.length) return props.items;
  const nodes = slots.default?.() ?? [];
  return nodes
    .filter((n: any) => n.props && n.props.value != null)
    .map((n: any) => ({
      value: String(n.props.value),
      label: n.props.label ?? String(n.props.value),
      disabled: !!n.props.disabled,
    }));
});

const inner = ref<string>(
  props.modelValue ?? fallback.value[0]?.value ?? ''
);
watch(
  () => props.modelValue,
  (v) => {
    if (v != null) inner.value = v;
  }
);
watch(fallback, (list) => {
  if (!list.find((i) => i.value === inner.value)) {
    inner.value = list[0]?.value ?? '';
  }
});

function pick(v: string, disabled?: boolean) {
  if (disabled) return;
  inner.value = v;
  emit('update:modelValue', v);
  emit('change', v);
}

const rootClass = computed(() =>
  tabsClass({
    variant: props.variant!,
    size: props.size!,
    align: props.align!,
  })
);
</script>

<template>
  <div :class="rootClass">
    <div class="ck-tabs__list" role="tablist">
      <button
        v-for="t in fallback"
        :key="t.value"
        type="button"
        role="tab"
        class="ck-tabs__tab"
        :class="{ 'is-active': inner === t.value, 'is-disabled': t.disabled }"
        :aria-selected="inner === t.value"
        :disabled="t.disabled || undefined"
        @click="pick(t.value, t.disabled)"
      >
        {{ t.label }}
      </button>
    </div>
    <div class="ck-tabs__panels">
      <slot :active="inner" />
    </div>
  </div>
</template>
