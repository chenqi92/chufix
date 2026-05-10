<script setup lang="ts">
import { CfResult, CfButton, CfLink } from '@chufix/vue';
</script>

<template>
  <div class="err">
    <CfResult
      status="404"
      title="页面走丢了"
      description="这个地址可能已经移动、被删除，或者你打错了字符。"
    >
      <template #footer>
        <div class="err__actions">
          <CfButton variant="primary">返回首页</CfButton>
          <CfButton variant="tertiary">联系支持</CfButton>
        </div>
        <p class="err__links">
          常见入口：<CfLink href="#">所有组件</CfLink> · <CfLink href="#">Blocks</CfLink> · <CfLink href="#">主题与 token</CfLink>
        </p>
      </template>
    </CfResult>
  </div>
</template>

<style scoped>
.err {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 480px;
  font-family: var(--font-sans);
}
.err__actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.err__links {
  margin: 16px 0 0;
  text-align: center;
  font-size: var(--t-12);
  color: var(--fg-3);
}
</style>
