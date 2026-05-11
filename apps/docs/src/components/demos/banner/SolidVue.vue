<script setup lang="ts">
import { CfBanner, CfButton } from '@chufix-design/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px;">
    <CfBanner variant="solid" tone="accent" dismissible>
      新版本 v2.0 上线 — 全新主题与三套密度
      <template #action>
        <CfButton size="sm" variant="ghost" style="color: inherit;">查看更新</CfButton>
      </template>
    </CfBanner>
    <CfBanner variant="solid" tone="warning" dismissible>
      您的免费额度还剩 3 天，及时升级避免服务中断。
    </CfBanner>
    <CfBanner variant="solid" tone="danger">
      检测到异常登录，请立即修改密码。
    </CfBanner>
  </div>
</template>
