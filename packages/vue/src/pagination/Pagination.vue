<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  type PaginationProps,
  buildPages,
  paginationClass,
} from './variants';

const props = withDefaults(defineProps<PaginationProps>(), {
  modelValue: 1,
  total: 0,
  pageSize: 10,
  siblingCount: 1,
  size: 'md',
  showNav: true,
  showJumper: false,
  showTotal: false,
});
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>();

const totalPages = computed(() =>
  Math.max(1, Math.ceil((props.total ?? 0) / (props.pageSize ?? 10)))
);
const current = computed({
  get: () => Math.max(1, Math.min(props.modelValue!, totalPages.value)),
  set: (v) => emit('update:modelValue', v),
});

const items = computed(() =>
  buildPages(current.value, totalPages.value, props.siblingCount!)
);

function go(p: number) {
  if (p < 1 || p > totalPages.value || p === current.value) return;
  current.value = p;
}

const jumper = ref<string>('');
watch(current, () => (jumper.value = ''));
function commitJumper() {
  const n = parseInt(jumper.value, 10);
  if (Number.isNaN(n)) return (jumper.value = '');
  go(n);
}

const rootClass = computed(() => paginationClass({ size: props.size! }));
</script>

<template>
  <nav :class="rootClass" role="navigation" aria-label="pagination">
    <span v-if="showTotal" class="cf-pagination__total">共 {{ total }} 条</span>

    <button
      v-if="showNav"
      type="button"
      class="cf-pagination__nav"
      :disabled="current <= 1"
      @click="go(current - 1)"
      aria-label="上一页"
    >‹</button>

    <button
      v-for="(p, idx) in items"
      :key="idx"
      type="button"
      class="cf-pagination__page"
      :class="{ 'is-active': p === current, 'is-ellipsis': p === '…' }"
      :disabled="p === '…'"
      :aria-current="p === current ? 'page' : undefined"
      @click="typeof p === 'number' && go(p)"
    >{{ p }}</button>

    <button
      v-if="showNav"
      type="button"
      class="cf-pagination__nav"
      :disabled="current >= totalPages"
      @click="go(current + 1)"
      aria-label="下一页"
    >›</button>

    <span v-if="showJumper" class="cf-pagination__jumper">
      跳至
      <input
        type="text"
        inputmode="numeric"
        v-model="jumper"
        @keydown.enter="commitJumper"
        @blur="commitJumper"
        class="cf-pagination__input"
      />
      页
    </span>
  </nav>
</template>
