<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { annularPath, buildLayout, pathTo, sumValue } from './layout';
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
  tween: 'fade',
  tweenDuration: 320,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: SunburstChartInteractionPayload): void;
  (e: 'item-leave', payload: SunburstChartInteractionPayload): void;
  (e: 'drill', payload: SunburstDrillPayload): void;
  (e: 'update:focusPath', value: string[]): void;
}>();

/* Resolve a path-of-names → stack of nodes starting from root. Stops at the
 * first name that doesn't match; that way invalid focusPaths fall back to the
 * deepest matching ancestor instead of throwing. */
function resolveStack(root: SunburstNode, path: string[] | undefined): SunburstNode[] {
  const out: SunburstNode[] = [root];
  if (!path?.length) return out;
  let cursor = root;
  for (let i = 1; i < path.length; i++) {
    const next = cursor.children?.find((c) => c.name === path[i]);
    if (!next) break;
    out.push(next);
    cursor = next;
  }
  return out;
}

const internalStack = ref<SunburstNode[]>([props.root]);

watch(
  () => props.root,
  (r) => {
    internalStack.value = [r];
  },
);

/* Sync controlled focusPath into internal stack when it changes (only when
 * the consumer is actively driving). */
watch(
  () => props.focusPath,
  (next) => {
    if (next == null) return;
    internalStack.value = resolveStack(props.root, next);
  },
);

const stack = computed<SunburstNode[]>(() => {
  if (props.focusPath != null) return resolveStack(props.root, props.focusPath);
  return internalStack.value;
});

function commitStack(next: SunburstNode[]) {
  const path = next.map((n) => n.name);
  if (props.focusPath != null) {
    /* Controlled: defer to the parent. */
    emit('update:focusPath', path);
    return;
  }
  internalStack.value = next;
  emit('update:focusPath', path);
}

const focused = computed(() => stack.value[stack.value.length - 1]);
const breadcrumb = computed(() => stack.value);

const layout = computed(() =>
  buildLayout(focused.value, {
    size: props.size,
    innerRadiusRatio: props.innerRadiusRatio,
  }),
);

/* ─────────── morph tween ───────────
 * For each new segment we look up the previous segment with the same node
 * reference and lerp startAngle / endAngle / inner-outer radius. Brand-new
 * segments grow from a "collapsed" start matching the new outer ring.
 * rAF-driven; cancelled cleanly on unmount or rapid re-trigger. */
type AnimSegment = ReturnType<typeof buildLayout>['segments'][number];
const displaySegments = ref<AnimSegment[]>([]);
let animFrame: number | null = null;
let prevForTween: AnimSegment[] = [];

function cancelAnim() {
  if (animFrame != null) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function rebuildPath(seg: AnimSegment): AnimSegment {
  const cx = props.size / 2;
  const cy = props.size / 2;
  return {
    ...seg,
    path: annularPath(cx, cy, seg.innerR, seg.outerR, seg.startAngle, seg.endAngle),
    midAngle: (seg.startAngle + seg.endAngle) / 2,
    midRadius: (seg.innerR + seg.outerR) / 2,
  };
}

function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

function runMorph(toSegs: AnimSegment[]) {
  cancelAnim();
  /* Reduced motion: snap immediately. */
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    displaySegments.value = toSegs;
    prevForTween = toSegs;
    return;
  }
  const fromMap = new Map<SunburstChartInteractionPayload['node'], AnimSegment>();
  for (const s of prevForTween) fromMap.set(s.node, s);
  const startTime = performance.now();
  const duration = Math.max(0, props.tweenDuration);

  const frame = (now: number) => {
    const elapsed = now - startTime;
    const k = duration > 0 ? Math.min(1, elapsed / duration) : 1;
    const ease = easeOutCubic(k);
    displaySegments.value = toSegs.map((toSeg) => {
      const fromSeg = fromMap.get(toSeg.node);
      const f = fromSeg ?? {
        ...toSeg,
        /* Collapsed slice at the target's start angle / inner ring. */
        startAngle: toSeg.startAngle,
        endAngle: toSeg.startAngle,
        innerR: toSeg.innerR,
        outerR: toSeg.innerR,
      };
      const next: AnimSegment = {
        ...toSeg,
        startAngle: lerp(f.startAngle, toSeg.startAngle, ease),
        endAngle: lerp(f.endAngle, toSeg.endAngle, ease),
        innerR: lerp(f.innerR, toSeg.innerR, ease),
        outerR: lerp(f.outerR, toSeg.outerR, ease),
      } as AnimSegment;
      return rebuildPath(next);
    });
    if (k < 1) animFrame = requestAnimationFrame(frame);
    else {
      animFrame = null;
      prevForTween = toSegs;
    }
  };
  animFrame = requestAnimationFrame(frame);
}

watch(
  layout,
  (next) => {
    if (props.tween !== 'morph') {
      displaySegments.value = next.segments;
      prevForTween = next.segments;
      return;
    }
    runMorph(next.segments);
  },
  { immediate: true },
);

onBeforeUnmount(cancelAnim);

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
  commitStack([...stack.value, seg.node]);
  emit('drill', { node: seg.node, pathNames: pathTo(props.root, seg.node) });
}

function drillTo(index: number) {
  if (!props.drillable) return;
  if (index === stack.value.length - 1) return;
  const next = stack.value.slice(0, index + 1);
  commitStack(next);
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
      <!--
        Two render paths:
        - `tween='fade'` (default): the whole layer fades / scales via Vue's
          <Transition> keyed on the ancestor path.
        - `tween='morph'`: per-segment angle / radius rAF interpolation, no
          fade wrapper (segments smoothly grow / shrink in place).
        Either way the source list comes from `displaySegments`, which the
        watcher keeps in sync with `layout`.
      -->
      <Transition v-if="tween === 'fade'" name="cf-sunburst-fade" mode="out-in" appear>
        <g :key="stack.map((n) => n.name).join('/')" class="cf-sunburst__layer">
          <path
            v-for="(seg, i) in displaySegments"
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
              v-for="(seg, i) in displaySegments.filter((s) => s.endAngle - s.startAngle >= labelMinAngle)"
              :key="`l${i}`"
              class="cf-sunburst__label"
              :x="labelXY(seg).x"
              :y="labelXY(seg).y"
              text-anchor="middle"
              dominant-baseline="central"
            >{{ seg.node.name }}</text>
          </template>
        </g>
      </Transition>
      <g v-else class="cf-sunburst__layer is-morph">
        <path
          v-for="(seg, i) in displaySegments"
          :key="seg.node.name + '|' + seg.depth"
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
            v-for="(seg, i) in displaySegments.filter((s) => s.endAngle - s.startAngle >= labelMinAngle)"
            :key="`l${i}`"
            class="cf-sunburst__label"
            :x="labelXY(seg).x"
            :y="labelXY(seg).y"
            text-anchor="middle"
            dominant-baseline="central"
          >{{ seg.node.name }}</text>
        </template>
      </g>

      <!-- Center "up one level" stays outside the transition so it doesn't blink. -->
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
    </svg>

    <footer v-if="drillable && canDrillUp" class="cf-sunburst__footer">
      <span class="cf-sunburst__focus-label">当前焦点 · {{ focused.name }}</span>
      <span class="cf-sunburst__focus-total">{{ focusedTotal.toLocaleString() }}</span>
    </footer>
  </div>
</template>
