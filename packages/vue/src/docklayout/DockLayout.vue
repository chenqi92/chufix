<script setup lang="ts">
import { ref } from 'vue';
import DockNode from './DockNode.vue';
import type {
  DockGroup,
  DockLayoutProps,
  DockPanel,
} from './variants';

const props = withDefaults(defineProps<DockLayoutProps>(), {
  active: () => ({}),
});

const emit = defineEmits<{
  (e: 'panel-close', groupId: string, panelId: string, panel: DockPanel): void;
  (e: 'panel-detach', groupId: string, panelId: string, panel: DockPanel): void;
  (e: 'active-change', groupId: string, panelId: string): void;
}>();

const localActive = ref<Record<string, string>>({ ...props.active });

function activeFor(group: DockGroup): string | null {
  if (!group.panels?.length) return null;
  return (
    localActive.value[group.id] ||
    props.active[group.id] ||
    group.panels[0].id
  );
}

function setActive(groupId: string, panelId: string) {
  localActive.value = { ...localActive.value, [groupId]: panelId };
  emit('active-change', groupId, panelId);
}

function panelStyle(p: DockGroup | DockPanel) {
  if (p.size == null) return undefined;
  return {
    flex: typeof p.size === 'number' ? `${p.size} ${p.size} 0` : `0 0 ${p.size}`,
  };
}

function emitClose(groupId: string, p: DockPanel) {
  emit('panel-close', groupId, p.id, p);
}
function emitDetach(groupId: string, p: DockPanel) {
  emit('panel-detach', groupId, p.id, p);
}
</script>

<template>
  <div class="cf-dock">
    <DockNode
      :group="layout"
      :active-for="activeFor"
      :set-active="setActive"
      :panel-style="panelStyle"
      :emit-close="emitClose"
      :emit-detach="emitDetach"
    >
      <template
        v-for="(_, name) in $slots"
        v-slot:[name]="slotProps: Record<string, unknown>"
      >
        <slot :name="name" v-bind="slotProps" />
      </template>
    </DockNode>
  </div>
</template>
