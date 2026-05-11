<script setup lang="ts">
import {
  CfAvatar,
  CfTabs,
  CfTabPanel,
  CfButton,
  CfDescriptionList,
  CfTimeline,
  CfTag,
  CfStat,
} from '@chufix-design/vue';

const profile = [
  { label: '邮箱', value: 'jane.l@example.com' },
  { label: '团队', value: 'Payments · 6 人' },
  { label: '加入', value: '2024-03-12' },
  { label: '时区', value: 'UTC+8' },
];

const activity = [
  { id: '1', title: '合并了 PR #842', desc: 'feat(orders): 支持批量退款', time: '2h 前', dotColor: 'success' as const },
  { id: '2', title: '提交评论', desc: '看起来 LGTM，建议补一个边界 case', time: '4h 前', dotColor: 'default' as const },
  { id: '3', title: '邀请了 jordan.kim', desc: '加入 Payments 团队', time: '昨天', dotColor: 'info' as const },
  { id: '4', title: '完成 OKR Q1', desc: '订单接口 P95 延迟降至 220ms', time: '2 天前', dotColor: 'success' as const },
];

const tags = ['payments', 'backend', 'go', 'postgres', 'redis'];
</script>

<template>
  <div class="prof">
    <header class="prof__head">
      <CfAvatar size="lg">JL</CfAvatar>
      <div class="prof__title">
        <h2>Jane Liu</h2>
        <p>Backend Engineer · Payments</p>
        <div class="prof__tags">
          <CfTag v-for="t in tags" :key="t" size="sm">{{ t }}</CfTag>
        </div>
      </div>
      <div class="prof__actions">
        <CfButton variant="primary">关注</CfButton>
        <CfButton variant="tertiary">发消息</CfButton>
      </div>
    </header>

    <section class="prof__stats">
      <CfStat label="提交" :value="284" />
      <CfStat label="PR" :value="42" />
      <CfStat label="评审" :value="118" />
      <CfStat label="问题" :value="7" />
    </section>

    <CfTabs default-value="overview">
      <CfTabPanel value="overview" label="概览">
        <div class="prof__pane">
          <h3>个人信息</h3>
          <CfDescriptionList :items="profile" />
        </div>
      </CfTabPanel>
      <CfTabPanel value="activity" label="动态">
        <div class="prof__pane">
          <CfTimeline :items="activity" />
        </div>
      </CfTabPanel>
      <CfTabPanel value="repos" label="仓库">
        <div class="prof__pane">
          <p>jane.l 拥有的 4 个仓库（基于 CfList 渲染）。</p>
        </div>
      </CfTabPanel>
    </CfTabs>
  </div>
</template>

<style scoped>
.prof {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: var(--font-sans);
}
.prof__head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line-1);
}
.prof__title {
  flex: 1;
  min-width: 0;
}
.prof__title h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.prof__title p {
  margin: 4px 0 8px;
  color: var(--fg-3);
  font-size: var(--t-13);
}
.prof__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.prof__actions {
  display: inline-flex;
  gap: 6px;
  flex-shrink: 0;
}
.prof__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.prof__pane {
  padding: 12px 0;
}
.prof__pane h3 {
  margin: 0 0 12px;
  font-size: var(--t-13);
  color: var(--fg-1);
  font-weight: var(--w-medium);
}
</style>
