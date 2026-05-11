<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  filterResults,
  type GlobalSearchProps,
  type GlobalSearchResult,
} from './variants';

const props = withDefaults(defineProps<GlobalSearchProps>(), {
  placeholder: '搜索任何内容…',
  emptyText: '无匹配结果',
  showCategories: true,
  closeOnSelect: true,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'select', id: string, result: GlobalSearchResult): void;
}>();

const query = ref('');
const activeCategory = ref<string | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const activeIndex = ref(0);

const allCategories = computed(() => {
  const set = new Set<string>();
  for (const r of props.results) set.add(r.category);
  return Array.from(set);
});

const groups = computed(() =>
  filterResults(props.results, query.value, activeCategory.value),
);

const flat = computed(() => groups.value.flatMap((g) => g.results));

watch(
  () => props.open,
  async (open) => {
    if (open) {
      query.value = '';
      activeCategory.value = null;
      activeIndex.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  },
  { immediate: true },
);

watch([query, activeCategory], () => {
  activeIndex.value = 0;
});

function close() {
  emit('update:open', false);
}

function pick(r: GlobalSearchResult) {
  if (r.disabled) return;
  emit('select', r.id, r);
  if (props.closeOnSelect) close();
}

function move(delta: number) {
  if (!flat.value.length) return;
  const n = flat.value.length;
  let i = activeIndex.value;
  for (let s = 0; s < n; s++) {
    i = (i + delta + n) % n;
    if (!flat.value[i].disabled) break;
  }
  activeIndex.value = i;
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    move(1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    move(-1);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const r = flat.value[activeIndex.value];
    if (r) pick(r);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
}
</script>

<template>
  <Teleport :to="to">
    <Transition name="cf-gs" appear>
      <div
        v-if="open"
        class="cf-globalsearch__overlay"
        @click="onOverlayClick"
        @keydown="onKeyDown"
      >
        <div class="cf-globalsearch" role="dialog" aria-modal="true">
          <div class="cf-globalsearch__input">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4" />
              <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="placeholder"
              autocomplete="off"
              spellcheck="false"
            />
            <kbd class="cf-globalsearch__hint">Esc</kbd>
          </div>

          <div
            v-if="showCategories && allCategories.length > 1"
            class="cf-globalsearch__cats"
            role="tablist"
          >
            <button
              type="button"
              class="cf-globalsearch__cat"
              :aria-pressed="activeCategory === null"
              @click="activeCategory = null"
            >
              全部
            </button>
            <button
              v-for="cat in allCategories"
              :key="cat"
              type="button"
              class="cf-globalsearch__cat"
              :aria-pressed="activeCategory === cat"
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>

          <div class="cf-globalsearch__list">
            <div v-if="!flat.length" class="cf-globalsearch__empty">{{ emptyText }}</div>
            <template v-else>
              <template v-for="grp in groups" :key="grp.category">
                <div class="cf-globalsearch__group-head">{{ grp.category }}</div>
                <button
                  v-for="r in grp.results"
                  :key="r.id"
                  type="button"
                  class="cf-globalsearch__row"
                  :class="{
                    'is-active':
                      flat.findIndex((f) => f.id === r.id) === activeIndex,
                    'is-disabled': r.disabled,
                  }"
                  :disabled="r.disabled"
                  @mouseenter="
                    activeIndex = flat.findIndex((f) => f.id === r.id)
                  "
                  @click="pick(r)"
                >
                  <div class="cf-globalsearch__col">
                    <div class="cf-globalsearch__title">
                      <span>{{ r.title }}</span>
                      <span v-if="r.badge" class="cf-globalsearch__badge">{{
                        r.badge
                      }}</span>
                    </div>
                    <div v-if="r.description || r.path" class="cf-globalsearch__sub">
                      <span v-if="r.path" class="cf-globalsearch__path">{{
                        r.path
                      }}</span>
                      <span v-if="r.description">{{ r.description }}</span>
                    </div>
                  </div>
                  <span v-if="r.shortcut" class="cf-globalsearch__shortcut">{{
                    r.shortcut
                  }}</span>
                </button>
              </template>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
