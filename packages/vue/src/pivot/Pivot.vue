<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue';
import { pivotCompute, type PivotProps } from './variants';

const props = withDefaults(defineProps<PivotProps<T>>(), {
  aggregator: 'sum',
  showTotals: true,
  size: 'md',
  heatmap: false,
});

const result = computed(() =>
  pivotCompute(props.data, props.rowField as string, props.colField as string, props.valueField as string | undefined, props.aggregator),
);

function formatCell(value: number | undefined, row: string, col: string): string {
  if (value === undefined) return '';
  if (props.format) return props.format(value, { row, col });
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function heatStyle(value: number | undefined): Record<string, string> {
  if (!props.heatmap || value === undefined) return {};
  const { min, max } = result.value;
  const span = max - min || 1;
  const t = (value - min) / span;
  const alpha = 0.05 + t * 0.4;
  const base = props.heatmapColor ?? 'var(--accent-1)';
  return {
    background: `color-mix(in oklch, ${base} ${alpha * 100}%, transparent)`,
  };
}

const clickable = computed(() => !!props.onCellClick);

function onCellClick(row: string, col: string, value: number | undefined) {
  if (!props.onCellClick) return;
  props.onCellClick({
    row,
    col,
    value: value ?? 0,
    rows: result.value.raw[row]?.[col] ?? [],
  });
}
</script>

<template>
  <div :class="['cf-pivot', `cf-pivot--${size}`]">
    <p v-if="caption" class="cf-pivot__caption">{{ caption }}</p>
    <div class="cf-pivot__scroll">
      <table class="cf-pivot__table">
        <thead>
          <tr>
            <th class="cf-pivot__corner">
              <span class="cf-pivot__corner-row">{{ String(rowField) }}</span>
              <span class="cf-pivot__corner-sep">/</span>
              <span class="cf-pivot__corner-col">{{ String(colField) }}</span>
            </th>
            <th
              v-for="c in result.colKeys"
              :key="c"
              class="cf-pivot__th cf-pivot__th--col"
              scope="col"
            >{{ c }}</th>
            <th v-if="showTotals" class="cf-pivot__th cf-pivot__th--total" scope="col">合计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in result.rowKeys" :key="r">
            <th class="cf-pivot__th cf-pivot__th--row" scope="row">{{ r }}</th>
            <td
              v-for="c in result.colKeys"
              :key="c"
              class="cf-pivot__cell"
              :class="{ 'is-empty': result.cells[r][c] === undefined, 'is-clickable': clickable }"
              :style="heatStyle(result.cells[r][c])"
              :role="clickable ? 'button' : undefined"
              :tabindex="clickable ? 0 : undefined"
              :aria-label="clickable ? `${r} × ${c}: ${formatCell(result.cells[r][c], r, c)}` : undefined"
              @click="onCellClick(r, c, result.cells[r][c])"
              @keydown.enter.prevent="onCellClick(r, c, result.cells[r][c])"
              @keydown.space.prevent="onCellClick(r, c, result.cells[r][c])"
            >
              {{ formatCell(result.cells[r][c], r, c) }}
            </td>
            <td v-if="showTotals" class="cf-pivot__cell cf-pivot__cell--total">
              {{ formatCell(result.rowTotals[r], r, '__total__') }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="showTotals">
          <tr>
            <th class="cf-pivot__th cf-pivot__th--row cf-pivot__th--total" scope="row">合计</th>
            <td
              v-for="c in result.colKeys"
              :key="c"
              class="cf-pivot__cell cf-pivot__cell--total"
            >{{ formatCell(result.colTotals[c], '__total__', c) }}</td>
            <td class="cf-pivot__cell cf-pivot__cell--grand">{{ formatCell(result.grandTotal, '__total__', '__total__') }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
