<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import {
  filterAndGroup,
  flatten,
  highlight,
  type CommandPaletteItem,
  type CommandPaletteProps,
} from './variants';

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: '搜索命令、请求、设置…',
  emptyText: '无匹配结果',
  closeOnSelect: true,
  to: 'body',
  hideFooter: false,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'select', id: string, item: CommandPaletteItem): void;
}>();

const query = ref('');
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLDivElement | null>(null);
const canRender = ref(false);

const groups = computed(() => filterAndGroup(props.items, query.value));
const flat = computed(() => flatten(groups.value));

onMounted(() => {
  canRender.value = true;
});

watch(
  [() => props.open, canRender],
  async ([open, ready]) => {
    if (open && ready) {
      query.value = '';
      activeIndex.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  },
  { immediate: true },
);

watch(query, () => {
  activeIndex.value = 0;
});

function close() {
  emit('update:open', false);
}

function pick(item: CommandPaletteItem) {
  if (item.disabled) return;
  emit('select', item.id, item);
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
  scrollActiveIntoView();
}

async function scrollActiveIntoView() {
  await nextTick();
  const el = listRef.value?.querySelectorAll<HTMLElement>(
    '.cf-cmdpal__row',
  )[activeIndex.value];
  el?.scrollIntoView({ block: 'nearest' });
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
    const it = flat.value[activeIndex.value];
    if (it) pick(it);
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
  <Teleport v-if="canRender" :to="to">
    <Transition name="cf-cmdpal" appear>
      <div
        v-if="open"
        class="cf-cmdpal__overlay"
        @click="onOverlayClick"
        @keydown="onKeyDown"
      >
        <div class="cf-cmdpal" role="dialog" aria-modal="true">
          <div class="cf-cmdpal__input">
            <svg class="cf-cmdpal__search-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4" fill="none" />
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
          </div>
          <div ref="listRef" class="cf-cmdpal__list">
            <template v-if="!flat.length">
              <div class="cf-cmdpal__empty">{{ emptyText }}</div>
            </template>
            <template v-else>
              <template v-for="(grp, gi) in groups" :key="grp.group || gi">
                <div v-if="grp.group" class="cf-cmdpal__section">
                  {{ grp.group }}
                </div>
                <button
                  v-for="(item, ii) in grp.items"
                  :key="item.id"
                  type="button"
                  class="cf-cmdpal__row"
                  :class="{
                    'is-active':
                      flat.findIndex((f) => f.id === item.id) === activeIndex,
                    'is-disabled': item.disabled,
                  }"
                  :aria-selected="
                    flat.findIndex((f) => f.id === item.id) === activeIndex
                  "
                  :disabled="item.disabled"
                  @mouseenter="
                    activeIndex = flat.findIndex((f) => f.id === item.id)
                  "
                  @click="pick(item)"
                >
                  <span class="cf-cmdpal__name">
                    <template v-for="(p, pi) in highlight(item.label, query).parts" :key="pi">
                      <strong v-if="p.match" class="cf-cmdpal__hl">{{ p.text }}</strong>
                      <template v-else>{{ p.text }}</template>
                    </template>
                  </span>
                  <span v-if="item.description" class="cf-cmdpal__desc">{{
                    item.description
                  }}</span>
                  <span v-if="item.shortcut" class="cf-cmdpal__shortcut">{{
                    item.shortcut
                  }}</span>
                </button>
              </template>
            </template>
          </div>
          <div v-if="!hideFooter" class="cf-cmdpal__footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
            <span><kbd>↵</kbd> 选择</span>
            <span class="cf-cmdpal__spacer" />
            <span><kbd>Esc</kbd> 关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
