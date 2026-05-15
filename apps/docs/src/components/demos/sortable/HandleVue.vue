<script setup lang="ts">
import { ref } from 'vue';
import { CfSortable } from '@chufix-design/vue';

interface Track {
  id: string;
  title: string;
  artist: string;
}

const tracks = ref<Track[]>([
  { id: '1', title: 'Northbound', artist: 'Riff Cohen' },
  { id: '2', title: 'Pyramids', artist: 'Frank Ocean' },
  { id: '3', title: 'Pegasus', artist: 'Inferno' },
  { id: '4', title: 'Cape', artist: 'Tycho' },
  { id: '5', title: 'Halftime', artist: 'Nas' },
]);
</script>

<template>
  <CfSortable v-model:items="tracks" item-key="id" handle=".track-grip">
    <template #default="{ item }">
      <div class="track-row">
        <button type="button" class="track-grip" aria-label="drag">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <circle cx="6" cy="4" r="1.2" fill="currentColor" />
            <circle cx="10" cy="4" r="1.2" fill="currentColor" />
            <circle cx="6" cy="8" r="1.2" fill="currentColor" />
            <circle cx="10" cy="8" r="1.2" fill="currentColor" />
            <circle cx="6" cy="12" r="1.2" fill="currentColor" />
            <circle cx="10" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </button>
        <div class="track-meta">
          <strong>{{ item.title }}</strong>
          <span>{{ item.artist }}</span>
        </div>
      </div>
    </template>
  </CfSortable>
</template>

<style scoped>
.track-row {
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-3);
  cursor: default;
}
.track-grip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: var(--fg-3);
  border-radius: var(--r-2);
  cursor: grab;
  touch-action: none;
}
.track-grip:hover {
  color: var(--fg-1);
  background: var(--bg-2);
}
.track-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.track-meta strong {
  color: var(--fg-1);
  font-size: var(--t-13);
}
.track-meta span {
  color: var(--fg-3);
  font-size: var(--t-12);
}
</style>
