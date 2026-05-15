<script setup lang="ts">
import { ref } from 'vue';
import { type PlanStep, formatMs } from './variants';

const props = withDefaults(
  defineProps<{
    title?: string;
    steps: PlanStep[];
    initialOpenIds?: string[];
  }>(),
  {},
);

const open = ref<Record<string, boolean>>(
  Object.fromEntries((props.initialOpenIds ?? []).map((id) => [id, true])),
);

function toggle(id: string) {
  open.value = { ...open.value, [id]: !open.value[id] };
}
</script>

<template>
  <div class="cf-plan">
    <header v-if="title" class="cf-plan__header">{{ title }}</header>
    <ol class="cf-plan__steps">
      <li
        v-for="step in steps"
        :key="step.id"
        class="cf-plan__step"
        :class="`cf-plan__step--${step.status}`"
      >
        <div class="cf-plan__bullet">
          <svg
            v-if="step.status === 'done'"
            viewBox="0 0 16 16"
            width="12"
            height="12"
          >
            <path d="M3 8l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg
            v-else-if="step.status === 'failed'"
            viewBox="0 0 16 16"
            width="12"
            height="12"
          >
            <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg
            v-else-if="step.status === 'active'"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            class="cf-plan__spinner"
          >
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.25" />
            <path d="M14 8a6 6 0 0 0-6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <span v-else-if="step.status === 'skipped'">—</span>
        </div>
        <div class="cf-plan__content">
          <button
            v-if="step.detail"
            type="button"
            class="cf-plan__row cf-plan__row--toggle"
            @click="toggle(step.id)"
          >
            <span class="cf-plan__title">{{ step.title }}</span>
            <span v-if="step.duration !== undefined" class="cf-plan__duration">{{ formatMs(step.duration) }}</span>
            <span class="cf-plan__caret" :class="{ 'is-open': open[step.id] }">›</span>
          </button>
          <div v-else class="cf-plan__row">
            <span class="cf-plan__title">{{ step.title }}</span>
            <span v-if="step.duration !== undefined" class="cf-plan__duration">{{ formatMs(step.duration) }}</span>
          </div>
          <p v-if="step.description" class="cf-plan__desc">{{ step.description }}</p>
          <pre v-if="step.detail && open[step.id]" class="cf-plan__detail">{{ step.detail }}</pre>
        </div>
      </li>
    </ol>
  </div>
</template>
