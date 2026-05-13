<script setup lang="ts">
import { CfAccordion, CfTag } from '@chufix-design/vue';

const items = [
  { value: 'shipping', title: '运输方式' },
  { value: 'returns', title: '退换政策' },
  { value: 'beta', title: 'Beta 计划' },
];
</script>

<template>
  <CfAccordion :items="items" variant="separated" :default-open="'shipping'">
    <!-- 自定义标题：加 tag / 副标题 -->
    <template #title-shipping>
      <span class="adm-title">
        运输方式
        <CfTag size="sm" tone="success" variant="soft">免运费</CfTag>
      </span>
    </template>

    <template #title-returns>
      <span class="adm-title">
        退换政策
        <span class="adm-sub">30 天无理由</span>
      </span>
    </template>

    <template #title-beta>
      <span class="adm-title">
        Beta 计划
        <CfTag size="sm" tone="warning" variant="soft">实验性</CfTag>
      </span>
    </template>

    <!-- 自定义面板内容：表格、列表等富内容 -->
    <template #shipping>
      <table class="adm-tab">
        <tr><th>地区</th><th>时效</th><th>运费</th></tr>
        <tr><td>本地</td><td>1–2 天</td><td>免</td></tr>
        <tr><td>跨省</td><td>3–5 天</td><td>免</td></tr>
        <tr><td>海外</td><td>10–15 天</td><td>¥80</td></tr>
      </table>
    </template>

    <template #returns>
      <ul class="adm-list">
        <li>购买后 30 天内可申请退换</li>
        <li>商品需保持全新且配件齐全</li>
        <li>非质量问题往返运费由买家承担</li>
      </ul>
    </template>

    <template #beta>
      <p class="adm-p">
        加入 Beta 计划后可优先体验新功能 —— 包括<strong>每周构建</strong>、
        实验性 API、未完成的 UI 等。请勿在生产环境使用。
      </p>
    </template>
  </CfAccordion>
</template>

<style scoped>
.adm-title { display: inline-flex; align-items: center; gap: 8px; }
.adm-sub { color: var(--fg-3); font-size: var(--t-12); }
.adm-tab { border-collapse: collapse; width: 100%; font-size: var(--t-13); }
.adm-tab th, .adm-tab td { border: 1px solid var(--line-1); padding: 6px 10px; text-align: left; }
.adm-tab th { background: var(--bg-2); color: var(--fg-2); font-weight: 600; }
.adm-list { margin: 0; padding-left: 18px; color: var(--fg-2); line-height: 1.7; }
.adm-p { margin: 0; color: var(--fg-2); line-height: 1.6; }
</style>
