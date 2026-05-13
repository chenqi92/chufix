<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { buildLayout, pathTo, sumValue } from './layout';
import type {
  SunburstChartInteractionPayload,
  SunburstChartProps,
  SunburstDrillPayload,
  SunburstNode,
} from './variants';

const props = withDefaults(defineProps<SunburstChartProps>(), {
  size: 240,
  innerRadiusRatio: 0.2,
  showLabels: true,
  labelMinAngle: 12,
  drillable: true,
  showBreadcrumb: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: SunburstChartInteractionPayload): void;
  (e: 'item-leave', payload: SunburstChartInteractionPayload): void;
  (e: 'drill', payload: SunburstDrillPayload): void;
}>();

/* Stack of ancestor nodes from the original root → current focus. The last
 * entry is the node currently being rendered. */
const stack = ref<SunburstNode[]>([props.root]);

watch(
  () => props.root,
  (r) => {
    /* Reset the stack whenever the source data changes. */
    stack.value = [r];
  },
);

const focused = computed(() => stack.value[stack.value.length - 1]);
const breadcrumb = computed(() => stack.value);

const layout = computed(() =>
  buildLayout(focused.value, {
    size: props.size,
    innerRadiusRatio: props.innerRadiusRatio,
  }),
);

function buildPayload(idx: number, ev: PointerEvent): SunburstChartInteractionPayload | null {
  const seg = layout.value.segments[idx];
  if (!seg) return null;
  return {
    node: seg.node,
    depth: seg.depth,
    pathNames: pathTo(props.root, seg.node),
    totalValue: sumValue(seg.node),
    nativeEvent: ev,
  };
}

function onEnter(idx: number, ev: PointerEvent) {
  const p = buildPayload(idx, ev);
  if (p) emit('item-enter', p);
}
function onLeave(idx: number, ev: PointerEvent) {
  const p = buildPayload(idx, ev);
  if (p) emit('item-leave', p);
}

function onSegmentClick(idx: number) {
  if (!props.drillable) return;
  const seg = layout.value.segments[idx];
  if (!seg) return;
  /* Leaf node — nothing to drill into. */
  if (!seg.node.children?.length) return;
  stack.value = [...stack.value, seg.node];
  emit('drill', { node: seg.node, pathNames: pathTo(props.root, seg.node) });
}

function drillTo(index: number) {
  if (!props.drillable) return;
  if (index === stack.value.length - 1) return;
  const next = stack.value.slice(0, index + 1);
  stack.value = next;
  const node = next[next.length - 1];
  emit('drill', { node, pathNames: pathTo(props.root, node) });
}

function drillUp() {
  if (!props.drillable || stack.value.length <= 1) return;
  drillTo(stack.value.length - 2);
}

function labelXY(seg: { midAngle: number; midRadius: number }) {
  const a = ((seg.midAngle - 90) * Math.PI) / 180;
  const cx = props.size / 2;
  const cy = props.size / 2;
  return { x: cx + seg.midRadius * Math.cos(a), y: cy + seg.midRadius * Math.sin(a) };
}

const centerX = computed(() => props.size / 2);
const centerY = computed(() => props.size / 2);
const focusedTotal = computed(() => sumValue(focused.value));
const canDrillUp = computed(() => stack.value.length > 1);
</script>

<template>
  <div class="cf-sunburst-frame">
    <nav v-if="drillable && showBreadcrumb && breadcrumb.length > 1" class="cf-sunburst__breadcrumb" aria-label="drill path">
      <button
        v-for="(node, i) in breadcrumb"
        :key="i"
        type="button"
        class="cf-sunburst__crumb"
        :class="{ 'is-current': i === breadcrumb.length - 1 }"
        :disabled="i === breadcrumb.length - 1"
        @click="drillTo(i)"
      >{{ node.name }}</button>
    </nav>

    <svg
      class="cf-chart cf-sunburst"
      :class="{ 'is-drillable': drillable }"
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
      role="img"
      :aria-label="ariaLabel ?? '旭日图'"
    >
      <g>
        <path
          v-for="(seg, i) in layout.segments"
          :key="i"
          :class="[
            'cf-sunburst__segment',
            `cf-chart__bar--${seg.colorIndex}`,
            drillable && seg.node.children?.length ? 'is-zoomable' : '',
          ]"
          :d="seg.path"
          :tabindex="drillable && seg.node.children?.length ? 0 : undefined"
          @pointerenter="(e: PointerEvent) => onEnter(i, e)"
          @pointerleave="(e: PointerEvent) => onLeave(i, e)"
          @click="onSegmentClick(i)"
          @keydown.enter.prevent="onSegmentClick(i)"
          @keydown.space.prevent="onSegmentClick(i)"
        >
          <title>{{ seg.node.name }}</title>
        </path>
        <template v-if="showLabels">
          <text
            v-for="(seg, i) in layout.segments.filter((s) => s.endAngle - s.startAngle >= labelMinAngle)"
            :key="`l${i}`"
            class="cf-sunburst__label"
            :x="labelXY(seg).x"
            :y="labelXY(seg).y"
            text-anchor="middle"
            dominant-baseline="central"
          >{{ seg.node.name }}</text>
        </template>

        <!-- Center "up one level" affordance when drilled in. -->
        <g
          v-if="drillable && canDrillUp"
          class="cf-sunburst__center"
          :transform="`translate(${centerX}, ${centerY})`"
          tabindex="0"
          role="button"
          aria-label="返回上一层"
          @click="drillUp"
          @keydown.enter.prevent="drillUp"
          @keydown.space.prevent="drillUp"
        >
          <circle r="22" />
          <text class="cf-sunburst__center-label" text-anchor="middle" dominant-baseline="middle" dy="-2">↑</text>
          <text class="cf-sunburst__center-name" text-anchor="middle" dominant-baseline="middle" dy="14">{{ focused.name }}</text>
        </g>
      </g>
    </svg>

    <footer v-if="drillable && canDrillUp" class="cf-sunburst__footer">
      <span class="cf-sunburst__focus-label">当前焦点 · {{ focused.name }}</span>
      <span class="cf-sunburst__focus-total">{{ focusedTotal.toLocaleString() }}</span>
    </footer>
  </div>
</template>
