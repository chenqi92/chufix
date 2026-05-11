<script setup lang="ts">
import type {
  DockGroup,
  DockPanel,
} from './variants';

defineProps<{
  group: DockGroup;
  activeFor: (g: DockGroup) => string | null;
  setActive: (groupId: string, panelId: string) => void;
  panelStyle: (p: DockGroup | DockPanel) => Record<string, string> | undefined;
  emitClose: (groupId: string, p: DockPanel) => void;
  emitDetach: (groupId: string, p: DockPanel) => void;
}>();
</script>

<template>
  <div
    v-if="group.children && group.children.length"
    :class="['cf-dock__split', `cf-dock__split--${group.orientation}`]"
    :style="panelStyle(group)"
  >
    <DockNode
      v-for="child in group.children"
      :key="child.id"
      :group="child"
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
  <div
    v-else
    class="cf-dock__pane"
    :style="panelStyle(group)"
  >
    <div class="cf-dock__tabs" role="tablist">
      <div
        v-for="pn in group.panels ?? []"
        :key="pn.id"
        :class="['cf-dock__tab', pn.id === activeFor(group) && 'is-active']"
        role="tab"
        :aria-selected="pn.id === activeFor(group)"
        @click="setActive(group.id, pn.id)"
      >
        <span class="cf-dock__tab-label">{{ pn.title }}</span>
        <button
          v-if="pn.detachable"
          type="button"
          class="cf-dock__tab-btn"
          title="分离"
          @click.stop="emitDetach(group.id, pn)"
        >⇱</button>
        <button
          v-if="pn.closable"
          type="button"
          class="cf-dock__tab-btn"
          title="关闭"
          @click.stop="emitClose(group.id, pn)"
        >×</button>
      </div>
    </div>
    <div class="cf-dock__body">
      <template v-for="pn in group.panels ?? []" :key="pn.id">
        <div v-if="pn.id === activeFor(group)" class="cf-dock__panel-content">
          <slot :name="`panel-${pn.contentKey ?? pn.id}`" />
        </div>
      </template>
    </div>
  </div>
</template>
