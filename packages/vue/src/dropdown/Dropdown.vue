<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  computeDropdownPosition,
  type DropdownPlacement,
  type DropdownItem,
  type DropdownProps,
} from './variants';

const props = withDefaults(defineProps<DropdownProps>(), {
  open: undefined,
  placement: 'bottom',
  offset: 6,
  closeOnSelect: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'select', item: DropdownItem, index: number): void;
}>();

const triggerRef = ref<HTMLSpanElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);
const canRender = ref(false);

const controlled = computed(() => props.open !== undefined);
const inner = ref(false);
const visible = computed({
  get: () => (controlled.value ? !!props.open : inner.value),
  set: (v) => {
    if (!controlled.value) inner.value = v;
    emit('update:open', v);
  },
});

const pos = ref({ top: 0, left: 0, placement: props.placement as DropdownPlacement });
const activeIndex = ref(-1);

function selectableIndices(): number[] {
  return props.items
    .map((it, i) => (it.divider || it.header || it.disabled ? -1 : i))
    .filter((i) => i >= 0);
}

async function reposition() {
  if (!triggerRef.value || !menuRef.value) return;
  const tRect = triggerRef.value.getBoundingClientRect();
  const mw = menuRef.value.offsetWidth;
  const mh = menuRef.value.offsetHeight;
  pos.value = computeDropdownPosition(tRect, mw, mh, props.placement, props.offset);
}

async function open() {
  if (props.disabled) return;
  visible.value = true;
  const sel = selectableIndices();
  activeIndex.value = sel[0] ?? -1;
  await nextTick();
  reposition();
}

function close() {
  visible.value = false;
  activeIndex.value = -1;
}

function onTriggerClick() {
  if (visible.value) close();
  else open();
}

function selectAt(i: number) {
  const it = props.items[i];
  if (!it || it.disabled || it.divider || it.header) return;
  emit('select', it, i);
  if (props.closeOnSelect) close();
}

function moveActive(dir: 1 | -1) {
  const sel = selectableIndices();
  if (!sel.length) return;
  const idx = sel.indexOf(activeIndex.value);
  let next: number;
  if (idx === -1) next = dir > 0 ? sel[0] : sel[sel.length - 1];
  else next = sel[(idx + dir + sel.length) % sel.length];
  activeIndex.value = next;
}

function onDocumentClick(e: MouseEvent) {
  if (!visible.value) return;
  const t = e.target as Node | null;
  if (!t) return;
  if (triggerRef.value?.contains(t)) return;
  if (menuRef.value?.contains(t)) return;
  close();
}

function onKeyDown(e: KeyboardEvent) {
  if (!visible.value) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      const t = e.target as Node | null;
      if (t && triggerRef.value?.contains(t)) {
        e.preventDefault();
        open();
      }
    }
    return;
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    moveActive(1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    moveActive(-1);
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (activeIndex.value >= 0) {
      e.preventDefault();
      selectAt(activeIndex.value);
    }
  } else if (e.key === 'Home') {
    e.preventDefault();
    const sel = selectableIndices();
    if (sel.length) activeIndex.value = sel[0];
  } else if (e.key === 'End') {
    e.preventDefault();
    const sel = selectableIndices();
    if (sel.length) activeIndex.value = sel[sel.length - 1];
  }
}

watch(visible, async (v) => {
  if (v) {
    await nextTick();
    reposition();
    document.addEventListener('mousedown', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
  } else {
    document.removeEventListener('mousedown', onDocumentClick, true);
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
  }
});

onMounted(() => {
  canRender.value = true;
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentClick, true);
  document.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('resize', reposition);
  window.removeEventListener('scroll', reposition, true);
});

const menuStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

const menuClass = computed(
  () => `cf-dropdown cf-dropdown--${pos.value.placement}`,
);

function itemKey(it: DropdownItem, i: number): string {
  return it.key ?? `${i}:${it.label ?? ''}`;
}
</script>

<template>
  <span
    ref="triggerRef"
    class="cf-dropdown-trigger"
    tabindex="0"
    @click="onTriggerClick"
    @keydown="onKeyDown"
  >
    <slot />
  </span>
  <Teleport v-if="canRender" to="body">
    <Transition name="cf-dropdown-fade">
      <div
        v-if="visible"
        ref="menuRef"
        :class="menuClass"
        role="menu"
        :style="menuStyle"
      >
        <template v-for="(item, i) in items" :key="itemKey(item, i)">
          <div v-if="item.divider" class="cf-dropdown__divider" role="separator" />
          <div v-else-if="item.header" class="cf-dropdown__header">{{ item.label }}</div>
          <button
            v-else
            type="button"
            class="cf-dropdown__item"
            :class="{
              'cf-dropdown__item--active': i === activeIndex,
              'cf-dropdown__item--danger': item.tone === 'danger',
            }"
            role="menuitem"
            :aria-disabled="item.disabled || undefined"
            :disabled="item.disabled"
            @click="selectAt(i)"
            @mouseenter="activeIndex = i"
          >
            <span v-if="item.icon" class="cf-dropdown__icon">{{ item.icon }}</span>
            <span class="cf-dropdown__label">{{ item.label }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>
