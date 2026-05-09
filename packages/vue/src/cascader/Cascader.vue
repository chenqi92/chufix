<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  cascaderClass,
  getLabelPath,
  type CascaderOption,
  type CascaderProps,
} from './variants';

const props = withDefaults(defineProps<CascaderProps>(), {
  defaultValue: () => [],
  placeholder: '请选择',
  separator: ' / ',
  size: 'md',
  disabled: false,
  clearable: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  change: [value: string[]];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<string[]>(props.defaultValue ?? []);
const value = computed<string[]>(() =>
  isControlled.value ? (props.modelValue as string[]) : internal.value,
);

const open = ref(false);
const activeTrail = ref<string[]>([]);

watch(
  value,
  (v) => {
    activeTrail.value = v.slice();
  },
  { immediate: true },
);

function commit(next: string[]) {
  if (!isControlled.value) internal.value = next;
  emit('update:modelValue', next);
  emit('change', next);
}

const columns = computed(() => {
  const cols: CascaderOption[][] = [props.options];
  let level: CascaderOption[] = props.options;
  for (const v of activeTrail.value) {
    const found = level.find((o) => o.value === v);
    if (!found || !found.children?.length) break;
    cols.push(found.children);
    level = found.children;
  }
  return cols;
});

const labels = computed(() => getLabelPath(props.options, value.value));
const display = computed(() => labels.value.join(props.separator));
const showClear = computed(() => props.clearable && value.value.length > 0);

function pick(colIndex: number, opt: CascaderOption) {
  if (opt.disabled) return;
  const trail = activeTrail.value.slice(0, colIndex);
  trail.push(opt.value);
  activeTrail.value = trail;
  if (!opt.children?.length) {
    commit(trail);
    open.value = false;
  }
}

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}

function clearValue(e: MouseEvent) {
  e.stopPropagation();
  commit([]);
  activeTrail.value = [];
}

function onBlur(e: FocusEvent) {
  const root = (e.currentTarget as HTMLElement).closest('.cf-cascader');
  setTimeout(() => {
    if (!root?.contains(document.activeElement)) open.value = false;
  }, 0);
}

const cls = computed(() =>
  cascaderClass({ size: props.size, disabled: props.disabled, className: props.className }),
);
</script>

<template>
  <div :class="cls" @focusout="onBlur">
    <button
      type="button"
      class="cf-cascader__trigger"
      :disabled="disabled"
      @click="toggle"
    >
      <span :class="['cf-cascader__value', !display && 'is-placeholder']">
        {{ display || placeholder }}
      </span>
      <button
        v-if="showClear"
        type="button"
        class="cf-cascader__clear"
        aria-label="清除"
        @click="clearValue"
      >×</button>
      <span class="cf-cascader__caret" aria-hidden>▾</span>
    </button>
    <div v-if="open" class="cf-cascader__panel">
      <div
        v-for="(col, ci) in columns"
        :key="ci"
        class="cf-cascader__col"
      >
        <button
          v-for="opt in col"
          :key="opt.value"
          type="button"
          :class="[
            'cf-cascader__item',
            opt.value === activeTrail[ci] && 'is-active',
            value[ci] === opt.value && 'is-selected',
            opt.disabled && 'is-disabled',
          ]"
          :disabled="opt.disabled"
          @mouseenter="opt.disabled || (activeTrail = [...activeTrail.slice(0, ci), opt.value])"
          @click="pick(ci, opt)"
        >
          <span class="cf-cascader__label">{{ opt.label }}</span>
          <span v-if="opt.children?.length" class="cf-cascader__arrow" aria-hidden>›</span>
        </button>
      </div>
    </div>
  </div>
</template>
