<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  layoutTreemap,
  treemapValue,
  type TreemapDrillPayload,
  type TreemapInteractionPayload,
  type TreemapNode,
  type TreemapProps,
} from './variants';

const props = withDefaults(defineProps<TreemapProps>(), {
  width: 480,
  height: 240,
  showLabels: true,
  childPadding: 4,
  headerHeight: 16,
  drillable: true,
  showBreadcrumb: true,
  layout: 'squarify',
});

const emit = defineEmits<{
  (e: 'item-enter', payload: TreemapInteractionPayload): void;
  (e: 'item-leave', payload: TreemapInteractionPayload): void;
  (e: 'drill', payload: TreemapDrillPayload): void;
  (e: 'update:focusPath', value: string[]): void;
}>();

/* Stack of ancestor nodes from the top siblings → current focus.
 *   stack = []      → render `props.nodes` (top-level)
 *   stack = [n]     → render n.children
 *   stack = [a, b]  → render b.children where b is a child of a
 */
const internalStack = ref<TreemapNode[]>([]);

watch(
  () => props.nodes,
  () => {
    internalStack.value = [];
  },
);

function resolveStack(siblings: TreemapNode[], path: string[] | undefined): TreemapNode[] {
  if (!path?.length) return [];
  const out: TreemapNode[] = [];
  let pool: TreemapNode[] | undefined = siblings;
  for (const name of path) {
    const nextNode: TreemapNode | undefined = pool?.find((n) => n.name === name);
    if (!nextNode) break;
    out.push(nextNode);
    pool = nextNode.children;
  }
  return out;
}

watch(
  () => props.focusPath,
  (next) => {
    if (next == null) return;
    internalStack.value = resolveStack(props.nodes ?? [], next);
  },
);

const stack = computed<TreemapNode[]>(() => {
  if (props.focusPath != null) return resolveStack(props.nodes ?? [], props.focusPath);
  return internalStack.value;
});

function commitStack(next: TreemapNode[]) {
  const path = next.map((n) => n.name);
  if (props.focusPath != null) {
    emit('update:focusPath', path);
    return;
  }
  internalStack.value = next;
  emit('update:focusPath', path);
}

const focusedChildren = computed<TreemapNode[]>(() => {
  if (!stack.value.length) return props.nodes ?? [];
  const last = stack.value[stack.value.length - 1];
  return last.children ?? [];
});

const rects = computed(() =>
  layoutTreemap(focusedChildren.value, props.width, props.height, {
    childPadding: props.childPadding,
    headerHeight: props.headerHeight,
    layout: props.layout,
  }),
);

const breadcrumb = computed<TreemapNode[]>(() => stack.value);
const canDrillUp = computed(() => stack.value.length > 0);
const focusedTotal = computed(() =>
  focusedChildren.value.reduce((s, n) => s + treemapValue(n), 0),
);
const focusedName = computed(() =>
  stack.value.length ? stack.value[stack.value.length - 1].name : '全部',
);

function pathFromRoot(node: TreemapNode): string[] {
  return [...stack.value.map((n) => n.name), node.name];
}

function onEnter(idx: number, ev: PointerEvent) {
  const r = rects.value[idx];
  if (!r) return;
  emit('item-enter', {
    node: r.node,
    dataIndex: r.dataIndex,
    depth: r.depth,
    pathNames: [...stack.value.map((n) => n.name), ...r.path],
    nativeEvent: ev,
  });
}
function onLeave(idx: number, ev: PointerEvent) {
  const r = rects.value[idx];
  if (!r) return;
  emit('item-leave', {
    node: r.node,
    dataIndex: r.dataIndex,
    depth: r.depth,
    pathNames: [...stack.value.map((n) => n.name), ...r.path],
    nativeEvent: ev,
  });
}

function onRectClick(idx: number) {
  if (!props.drillable) return;
  const r = rects.value[idx];
  /* Only top-level rects of the current focus drill-in; nested children
   * already in view stay non-drillable to keep the affordance predictable. */
  if (!r || r.depth !== 0 || !r.hasChildren) return;
  commitStack([...stack.value, r.node]);
  emit('drill', { node: r.node, pathNames: pathFromRoot(r.node) });
}

function drillTo(index: number) {
  if (!props.drillable) return;
  if (index === stack.value.length - 1) return;
  const next = index < 0 ? [] : stack.value.slice(0, index + 1);
  commitStack(next);
  const node = next.length ? next[next.length - 1] : null;
  emit('drill', { node, pathNames: node ? pathFromRoot(node) : [] });
}

function drillUp() {
  if (!props.drillable || !stack.value.length) return;
  drillTo(stack.value.length - 2);
}
</script>

<template>
  <div class="cf-treemap-frame">
    <nav v-if="drillable && showBreadcrumb && canDrillUp" class="cf-treemap__breadcrumb" aria-label="drill path">
      <button type="button" class="cf-treemap__crumb" @click="drillTo(-1)">全部</button>
      <button
        v-for="(node, i) in breadcrumb"
        :key="i"
        type="button"
        class="cf-treemap__crumb"
        :class="{ 'is-current': i === breadcrumb.length - 1 }"
        :disabled="i === breadcrumb.length - 1"
        @click="drillTo(i)"
      >{{ node.name }}</button>
      <button type="button" class="cf-treemap__up" :disabled="!canDrillUp" @click="drillUp">↑ 上一层</button>
    </nav>

    <svg
      class="cf-chart cf-treemap"
      :class="{ 'is-drillable': drillable }"
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      role="img"
      :aria-label="ariaLabel ?? '矩形树图'"
    >
      <g
        v-for="(r, i) in rects"
        :key="i"
        :class="['cf-treemap__cell', r.hasChildren ? 'has-children' : '', r.depth === 0 ? 'is-top' : 'is-nested']"
        @pointerenter="(e: PointerEvent) => onEnter(i, e)"
        @pointerleave="(e: PointerEvent) => onLeave(i, e)"
        @click="onRectClick(i)"
      >
        <rect
          :class="`cf-chart__bar--${r.colorIndex}`"
          :x="r.x"
          :y="r.y"
          :width="r.w"
          :height="r.h"
          stroke="var(--bg-1)"
          stroke-width="1"
          :opacity="r.depth === 0 ? (r.hasChildren ? 0.35 : 0.9) : 0.85"
        />
        <text
          v-if="showLabels && r.w > 50 && r.h > 14"
          :x="r.x + 6"
          :y="r.y + (r.depth === 0 && r.hasChildren ? 12 : 14)"
          :font-weight="r.depth === 0 ? 600 : 500"
          fill="var(--fg-on-viz, var(--fg-1))"
        >{{ r.node.name }}</text>
        <text
          v-if="showLabels && r.w > 80 && r.h > 30 && !r.hasChildren"
          :x="r.x + 6"
          :y="r.y + 28"
          fill="var(--fg-on-viz, var(--fg-2))"
          opacity="0.85"
          font-size="11"
        >{{ treemapValue(r.node).toLocaleString() }}</text>
      </g>
    </svg>

    <footer v-if="canDrillUp" class="cf-treemap__footer">
      <span class="cf-treemap__focus-label">当前焦点 · {{ focusedName }}</span>
      <span class="cf-treemap__focus-total">{{ focusedTotal.toLocaleString() }}</span>
    </footer>
  </div>
</template>
