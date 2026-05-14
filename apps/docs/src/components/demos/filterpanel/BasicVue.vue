<script setup lang="ts">
import { ref } from 'vue';
import { CfFilterPanel, CfFilterSection, CfCheckbox, CfInput, type SavedView } from '@chufix-design/vue';

const views: SavedView[] = [
  { id: 'mine', label: '我的', count: 24 },
  { id: 'team', label: '团队', count: 87 },
  { id: 'all',  label: '全部', count: 312 },
];
const activeView = ref('mine');

const status = ref({ open: true, closed: false, draft: true });
const team   = ref({ design: true, eng: true, pm: false });
const query  = ref('');
</script>

<template>
  <CfFilterPanel
    :saved-views="views"
    :active-view-id="activeView"
    :active-filters="3"
    @view-change="activeView = $event"
    @apply="$emit('apply')"
    @reset="status = { open: false, closed: false, draft: false }; team = { design: false, eng: false, pm: false }; query = ''"
  >
    <CfFilterSection title="搜索">
      <CfInput v-model="query" placeholder="按关键词搜索…" />
    </CfFilterSection>
    <CfFilterSection title="状态" :count="2">
      <label class="demo-row"><CfCheckbox v-model="status.open"   /> 进行中</label>
      <label class="demo-row"><CfCheckbox v-model="status.closed" /> 已完成</label>
      <label class="demo-row"><CfCheckbox v-model="status.draft"  /> 草稿</label>
    </CfFilterSection>
    <CfFilterSection title="团队" :count="2">
      <label class="demo-row"><CfCheckbox v-model="team.design" /> 设计</label>
      <label class="demo-row"><CfCheckbox v-model="team.eng"    /> 工程</label>
      <label class="demo-row"><CfCheckbox v-model="team.pm"     /> 产品</label>
    </CfFilterSection>
  </CfFilterPanel>
</template>

<style scoped>
.demo-row { display: flex; align-items: center; gap: 8px; font-size: var(--t-13); cursor: pointer; }
</style>
