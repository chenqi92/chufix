<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SpeedDialAction, SpeedDialProps } from './variants';

const props = withDefaults(defineProps<SpeedDialProps>(), {
  direction: 'up',
  position: 'bottom-right',
  trigger: 'click',
  showLabels: 'hover',
  defaultOpen: false,
  ariaLabel: '展开操作',
});

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'action', key: string, action: SpeedDialAction): void;
}>();

const isControlled = computed(() => typeof props.open === 'boolean');
const internal = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? (props.open as boolean) : internal.value));

function setOpen(v: boolean) {
  if (!isControlled.value) internal.value = v;
  emit('update:open', v);
}
function toggle() { setOpen(!open.value); }

function onAction(a: SpeedDialAction) {
  if (a.disabled) return;
  emit('action', a.key, a);
  setOpen(false);
}

function onTriggerEnter() {
  if (props.trigger === 'hover') setOpen(true);
}
function onTriggerLeave() {
  if (props.trigger === 'hover') setOpen(false);
}
</script>

<template>
  <div
    :class="[
      'cf-speeddial',
      `cf-speeddial--${position}`,
      `cf-speeddial--${direction}`,
      `cf-speeddial--labels-${showLabels}`,
      open && 'is-open',
    ]"
    @mouseleave="onTriggerLeave"
  >
    <ul v-if="open" class="cf-speeddial__list" role="menu">
      <li
        v-for="action in actions"
        :key="action.key"
        class="cf-speeddial__item"
        role="none"
      >
        <span v-if="showLabels !== 'never' && action.label" class="cf-speeddial__label">{{ action.label }}</span>
        <button
          type="button"
          role="menuitem"
          class="cf-speeddial__action"
          :disabled="action.disabled"
          :aria-label="action.label || action.key"
          :title="action.label"
          @click="onAction(action)"
        >
          <slot :name="`icon-${action.key}`" :action="action">
            <svg v-if="action.iconPath" viewBox="0 0 24 24" width="20" height="20"><path :d="action.iconPath" fill="currentColor" /></svg>
          </slot>
        </button>
      </li>
    </ul>
    <button
      type="button"
      class="cf-speeddial__trigger"
      :aria-label="ariaLabel"
      :aria-expanded="open"
      @click="toggle"
      @mouseenter="onTriggerEnter"
    >
      <slot name="trigger">
        <svg viewBox="0 0 24 24" width="22" height="22" class="cf-speeddial__trigger-icon">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" />
        </svg>
      </slot>
    </button>
  </div>
</template>
