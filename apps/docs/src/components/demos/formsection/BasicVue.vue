<script setup lang="ts">
import { CfFormSection, CfFormGrid, CfFieldRow } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-scope">
    <CfFormSection title="账号信息" description="登录所需的基础字段" anchor="account">
      <CfFormGrid :columns="2">
        <CfFieldRow label="账号"><input class="cf-input" /></CfFieldRow>
        <CfFieldRow label="邮箱"><input class="cf-input" /></CfFieldRow>
      </CfFormGrid>
    </CfFormSection>

    <CfFormSection title="高级设置" collapsible :defaultOpen="false">
      <CfFieldRow label="API 端点" hint="高级用户可自定义">
        <input class="cf-input" />
      </CfFieldRow>
    </CfFormSection>
  </div>
</template>

<style scoped>
.demo-scope { display: flex; flex-direction: column; gap: 16px; max-width: 560px; }
</style>
