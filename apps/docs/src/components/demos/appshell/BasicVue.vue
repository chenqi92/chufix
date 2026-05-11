<script setup lang="ts">
import { ref } from 'vue';
import { CfAppShell, CfButton } from '@chufix-design/vue';

const collapsed = ref(false);
</script>

<template>
  <div style="height: 360px; border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
    <CfAppShell :sidebar-collapsed="collapsed" :sidebar-width="180">
      <template #header>
        <div style="display:flex; align-items:center; gap: 12px; width: 100%;">
          <CfButton size="sm" variant="tertiary" @click="collapsed = !collapsed">
            {{ collapsed ? '展开侧栏' : '收起侧栏' }}
          </CfButton>
          <strong style="margin-right:auto;">My App</strong>
          <span style="font-size: 12px; color: var(--fg-3);">user@example.com</span>
        </div>
      </template>
      <template #sidebar>
        <nav style="padding: 12px;">
          <div style="font-size: 11px; color: var(--fg-3); padding: 0 8px 6px;">导航</div>
          <a href="#" style="display:block; padding: 6px 8px; border-radius: 4px; background: var(--accent-soft); color: var(--accent-1); font-size: 13px;">概览</a>
          <a href="#" style="display:block; padding: 6px 8px; border-radius: 4px; color: var(--fg-2); font-size: 13px;">分析</a>
          <a href="#" style="display:block; padding: 6px 8px; border-radius: 4px; color: var(--fg-2); font-size: 13px;">订单</a>
          <a href="#" style="display:block; padding: 6px 8px; border-radius: 4px; color: var(--fg-2); font-size: 13px;">用户</a>
          <a href="#" style="display:block; padding: 6px 8px; border-radius: 4px; color: var(--fg-2); font-size: 13px;">设置</a>
        </nav>
      </template>
      <template #footer>
        © ChuFix · v0.0.1
      </template>
      <div style="padding: 24px;">
        <h2 style="margin: 0 0 6px; font-size: 18px;">主区域</h2>
        <p style="margin: 0; color: var(--fg-2);">点击左上角按钮可以收起 / 展开侧栏。</p>
      </div>
    </CfAppShell>
  </div>
</template>
