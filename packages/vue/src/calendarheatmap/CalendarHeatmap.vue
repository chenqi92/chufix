<script setup lang="ts">
import { computed } from 'vue';
import {
  buildCells,
  calendarHeatmapClass,
  type CalendarHeatmapProps,
} from './variants';

const props = withDefaults(defineProps<CalendarHeatmapProps>(), {
  thresholds: () => [1, 3, 6, 10],
});

const cls = computed(() => calendarHeatmapClass({ className: props.className }));

const built = computed(() =>
  buildCells(props.data, props.startDate, props.endDate, props.thresholds),
);

const dowLabels = ['日', '一', '二', '三', '四', '五', '六'];
</script>

<template>
  <div :class="cls">
    <div class="cf-heatmap__months">
      <span
        v-for="m in built.months"
        :key="`${m.week}-${m.label}`"
        class="cf-heatmap__month"
        :style="{ gridColumn: `${m.week + 2}` }"
      >{{ m.label }}</span>
    </div>
    <div class="cf-heatmap__grid">
      <div class="cf-heatmap__dow">
        <span v-for="(d, i) in dowLabels" :key="d" :class="['cf-heatmap__dow-cell', i % 2 === 1 ? '' : 'is-hidden']">{{ d }}</span>
      </div>
      <div class="cf-heatmap__weeks">
        <div
          v-for="(week, wi) in built.weeks"
          :key="wi"
          class="cf-heatmap__week"
        >
          <div
            v-for="(cell, di) in week"
            :key="di"
            :class="['cf-heatmap__cell', `is-l${cell.level}`, !cell.inRange && 'is-empty']"
            :title="cell.inRange ? `${cell.date}: ${cell.value}` : ''"
          />
        </div>
      </div>
    </div>
    <div class="cf-heatmap__legend">
      <span>少</span>
      <span class="cf-heatmap__cell is-l0" />
      <span class="cf-heatmap__cell is-l1" />
      <span class="cf-heatmap__cell is-l2" />
      <span class="cf-heatmap__cell is-l3" />
      <span class="cf-heatmap__cell is-l4" />
      <span>多</span>
    </div>
  </div>
</template>
