<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { appShellClass, type AppShellProps } from './variants';

const props = withDefaults(defineProps<AppShellProps>(), {
  variant: 'default',
  sidebarWidth: 240,
  bordered: true,
  sidebarCollapsed: false,
});

const slots = useSlots();

const cls = computed(() =>
  appShellClass({
    variant: props.variant,
    bordered: props.bordered,
    sidebarCollapsed: props.sidebarCollapsed,
  }),
);

const styles = computed(() => {
  const out: Record<string, string> = {};
  out['--cf-appshell-sidebar-width'] = `${props.sidebarWidth}px`;
  if (props.headerHeight) out['--cf-appshell-header-height'] = `${props.headerHeight}px`;
  return out;
});
</script>

<template>
  <div :class="cls" :style="styles">
    <header v-if="slots.header" class="cf-appshell__header">
      <slot name="header" />
    </header>
    <aside v-if="slots.sidebar" class="cf-appshell__sidebar">
      <slot name="sidebar" />
    </aside>
    <main class="cf-appshell__main">
      <slot />
    </main>
    <aside v-if="slots.aside" class="cf-appshell__aside">
      <slot name="aside" />
    </aside>
    <footer v-if="slots.footer" class="cf-appshell__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
