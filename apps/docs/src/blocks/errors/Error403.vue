<script setup lang="ts">
import { CfResult, CfButton, CfBanner } from '@chufix/vue';
</script>

<template>
  <div class="err">
    <CfResult
      status="403"
      title="无访问权限"
      description="当前账号 · jane.l · 没有访问此资源的权限。"
    >
      <template #footer>
        <div class="err__banner">
          <CfBanner
            tone="warning"
            title="需要 admin 角色"
            description="联系工作区所有者授予 'team-orders' 的 read 权限即可访问。"
          />
        </div>
        <div class="err__actions">
          <CfButton variant="primary">申请权限</CfButton>
          <CfButton variant="tertiary">切换账号</CfButton>
        </div>
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
  min-height: 540px;
  font-family: var(--font-sans);
}
.err__banner {
  max-width: 480px;
  margin: 0 auto 16px;
}
.err__actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
