<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { navMenuClass, type NavMenuItem, type NavMenuProps } from './variants';

const props = withDefaults(defineProps<NavMenuProps>(), {
  variant: 'underline',
  trigger: 'hover',
});

const emit = defineEmits<{
  (e: 'navigate', item: NavMenuItem): void;
}>();

const openKey = ref<string | null>(null);
const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const rootRef = ref<HTMLElement | null>(null);

const cls = computed(() => navMenuClass({ variant: props.variant }));

function clearCloseTimer() {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value);
    closeTimer.value = null;
  }
}

function open(key: string) {
  clearCloseTimer();
  openKey.value = key;
}

function scheduleClose() {
  clearCloseTimer();
  closeTimer.value = setTimeout(() => {
    openKey.value = null;
  }, 120);
}

function onTriggerEnter(item: NavMenuItem) {
  if (props.trigger !== 'hover' || !item.links?.length || item.disabled) return;
  open(item.key);
}

function onTriggerClick(item: NavMenuItem) {
  if (item.disabled) return;
  if (item.links?.length) {
    if (openKey.value === item.key) openKey.value = null;
    else open(item.key);
  } else {
    emit('navigate', item);
  }
}

function onPanelEnter() {
  clearCloseTimer();
}
function onPanelLeave() {
  if (props.trigger !== 'hover') return;
  scheduleClose();
}

function onTriggerLeave() {
  if (props.trigger !== 'hover') return;
  scheduleClose();
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value || rootRef.value.contains(e.target as Node)) return;
  openKey.value = null;
}

if (typeof window !== 'undefined') {
  document.addEventListener('mousedown', onDocClick);
}

onBeforeUnmount(() => {
  clearCloseTimer();
  if (typeof window !== 'undefined') {
    document.removeEventListener('mousedown', onDocClick);
  }
});

const openItem = computed(() =>
  props.items.find((i) => i.key === openKey.value) ?? null,
);

const panelStyle = computed(() => {
  const cols = openItem.value?.columns ?? 2;
  return { '--cf-navmenu-cols': String(cols) };
});
</script>

<template>
  <nav ref="rootRef" :class="cls" aria-label="主导航">
    <ul class="cf-navmenu__list">
      <li
        v-for="item in items"
        :key="item.key"
        class="cf-navmenu__item"
        :class="[
          active === item.key && 'is-active',
          item.disabled && 'is-disabled',
          openKey === item.key && 'is-open',
        ]"
        @mouseenter="onTriggerEnter(item)"
        @mouseleave="onTriggerLeave"
      >
        <a
          v-if="!item.links?.length"
          class="cf-navmenu__trigger"
          :href="item.href ?? '#'"
          :aria-disabled="item.disabled"
          @click.prevent="onTriggerClick(item)"
        >
          <span>{{ item.label }}</span>
        </a>
        <button
          v-else
          type="button"
          class="cf-navmenu__trigger"
          :aria-haspopup="'true'"
          :aria-expanded="openKey === item.key"
          @click="onTriggerClick(item)"
        >
          <span>{{ item.label }}</span>
          <svg viewBox="0 0 16 16" class="cf-navmenu__caret" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </li>
    </ul>

    <div
      v-if="openItem && openItem.links?.length"
      class="cf-navmenu__panel"
      :style="panelStyle"
      @mouseenter="onPanelEnter"
      @mouseleave="onPanelLeave"
    >
      <a
        v-for="link in openItem.links"
        :key="link.href"
        :href="link.href"
        class="cf-navmenu__link"
      >
        <span v-if="link.icon" class="cf-navmenu__link-icon" v-html="link.icon" />
        <span class="cf-navmenu__link-body">
          <span class="cf-navmenu__link-label">{{ link.label }}</span>
          <span v-if="link.description" class="cf-navmenu__link-description">
            {{ link.description }}
          </span>
        </span>
      </a>
    </div>
  </nav>
</template>
