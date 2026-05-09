<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  isGroup,
  sidebarClass,
  type SidebarEntry,
  type SidebarItem,
  type SidebarProps,
} from './variants';

const props = withDefaults(defineProps<SidebarProps>(), {
  modelValue: '',
  collapsed: false,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', key: string, item: SidebarItem): void;
  (e: 'update:openKeys', keys: string[]): void;
  (e: 'select', item: SidebarItem): void;
}>();

const internalOpen = ref<string[]>([]);

watch(
  () => props.defaultOpenKeys,
  (v) => {
    if (v) internalOpen.value = [...v];
  },
  { immediate: true },
);

const openSet = computed(() => {
  const keys = props.openKeys ?? internalOpen.value;
  return new Set(keys);
});

function toggle(key: string) {
  if (props.collapsed) return;
  const set = new Set(openSet.value);
  if (set.has(key)) set.delete(key);
  else set.add(key);
  const next = Array.from(set);
  if (props.openKeys === undefined) internalOpen.value = next;
  emit('update:openKeys', next);
}

function select(item: SidebarItem) {
  if (item.disabled) return;
  emit('update:modelValue', item.key, item);
  emit('select', item);
}

const cls = computed(() =>
  sidebarClass({ size: props.size, collapsed: props.collapsed }),
);

function flatItemList(entries: SidebarEntry[]): SidebarItem[] {
  return entries.flatMap((e) => (isGroup(e) ? e.items : [e]));
}

function getItemClass(item: SidebarItem) {
  return [
    'cf-sidebar__item',
    props.modelValue === item.key && 'is-active',
    item.disabled && 'is-disabled',
    item.children?.length && 'has-children',
    item.children?.length && openSet.value.has(item.key) && 'is-open',
  ]
    .filter(Boolean)
    .join(' ');
}
</script>

<template>
  <nav :class="cls" aria-label="侧栏">
    <template v-for="entry in items" :key="entry.key ?? (isGroup(entry) ? `g-${entry.label}` : entry.key)">
      <div v-if="isGroup(entry)" class="cf-sidebar__group">
        <div
          v-if="entry.label && !collapsed"
          class="cf-sidebar__group-label"
        >{{ entry.label }}</div>
        <ul class="cf-sidebar__list">
          <li
            v-for="item in entry.items"
            :key="item.key"
            :class="getItemClass(item)"
          >
            <a
              v-if="!item.children?.length"
              :href="item.href ?? '#'"
              class="cf-sidebar__link"
              :aria-disabled="item.disabled"
              :aria-current="modelValue === item.key ? 'page' : undefined"
              :title="collapsed ? item.label : undefined"
              @click.prevent="select(item)"
            >
              <span v-if="item.icon" class="cf-sidebar__icon" v-html="item.icon" />
              <span class="cf-sidebar__label">{{ item.label }}</span>
              <span v-if="item.badge != null" class="cf-sidebar__badge">{{ item.badge }}</span>
            </a>
            <button
              v-else
              type="button"
              class="cf-sidebar__link cf-sidebar__link--branch"
              :aria-expanded="openSet.has(item.key)"
              :title="collapsed ? item.label : undefined"
              @click="toggle(item.key)"
            >
              <span v-if="item.icon" class="cf-sidebar__icon" v-html="item.icon" />
              <span class="cf-sidebar__label">{{ item.label }}</span>
              <svg class="cf-sidebar__caret" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <ul
              v-if="item.children?.length && openSet.has(item.key) && !collapsed"
              class="cf-sidebar__sublist"
            >
              <li
                v-for="child in item.children"
                :key="child.key"
                :class="[
                  'cf-sidebar__item cf-sidebar__item--child',
                  modelValue === child.key && 'is-active',
                  child.disabled && 'is-disabled',
                ]"
              >
                <a
                  :href="child.href ?? '#'"
                  class="cf-sidebar__link"
                  :aria-current="modelValue === child.key ? 'page' : undefined"
                  @click.prevent="select(child)"
                >
                  <span class="cf-sidebar__label">{{ child.label }}</span>
                  <span v-if="child.badge != null" class="cf-sidebar__badge">{{ child.badge }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ul v-else class="cf-sidebar__list">
        <li :class="getItemClass(entry)">
          <a
            v-if="!entry.children?.length"
            :href="entry.href ?? '#'"
            class="cf-sidebar__link"
            :aria-disabled="entry.disabled"
            :aria-current="modelValue === entry.key ? 'page' : undefined"
            :title="collapsed ? entry.label : undefined"
            @click.prevent="select(entry)"
          >
            <span v-if="entry.icon" class="cf-sidebar__icon" v-html="entry.icon" />
            <span class="cf-sidebar__label">{{ entry.label }}</span>
            <span v-if="entry.badge != null" class="cf-sidebar__badge">{{ entry.badge }}</span>
          </a>
          <button
            v-else
            type="button"
            class="cf-sidebar__link cf-sidebar__link--branch"
            :aria-expanded="openSet.has(entry.key)"
            :title="collapsed ? entry.label : undefined"
            @click="toggle(entry.key)"
          >
            <span v-if="entry.icon" class="cf-sidebar__icon" v-html="entry.icon" />
            <span class="cf-sidebar__label">{{ entry.label }}</span>
            <svg class="cf-sidebar__caret" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <ul
            v-if="entry.children?.length && openSet.has(entry.key) && !collapsed"
            class="cf-sidebar__sublist"
          >
            <li
              v-for="child in entry.children"
              :key="child.key"
              :class="[
                'cf-sidebar__item cf-sidebar__item--child',
                modelValue === child.key && 'is-active',
                child.disabled && 'is-disabled',
              ]"
            >
              <a
                :href="child.href ?? '#'"
                class="cf-sidebar__link"
                :aria-current="modelValue === child.key ? 'page' : undefined"
                @click.prevent="select(child)"
              >
                <span class="cf-sidebar__label">{{ child.label }}</span>
                <span v-if="child.badge != null" class="cf-sidebar__badge">{{ child.badge }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </nav>
</template>
