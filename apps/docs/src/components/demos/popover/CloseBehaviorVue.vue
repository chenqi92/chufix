<script setup lang="ts">
import { CfButton, CfPopover } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <CfPopover placement="bottom" :close-on-outside="false">
        <CfButton variant="secondary">closeOnOutside = false</CfButton>
        <template #content>
          <strong>外部点击不会关闭</strong>
          <p class="adm-p">仅 Esc 或再次点击触发器才能关闭。</p>
        </template>
      </CfPopover>
      <span class="adm-hint">点页面任意位置都不会关</span>
    </div>

    <div class="demo-row">
      <CfPopover placement="bottom" :close-on-esc="false">
        <CfButton variant="secondary">closeOnEsc = false</CfButton>
        <template #content>
          <strong>Esc 不会关闭</strong>
          <p class="adm-p">仅外部点击或再次点击触发器才能关闭。</p>
        </template>
      </CfPopover>
      <span class="adm-hint">键盘 Esc 无效</span>
    </div>

    <div class="demo-row">
      <CfPopover placement="bottom" :close-on-outside="false" :close-on-esc="false">
        <CfButton variant="secondary">两者都 false</CfButton>
        <template #content>
          <strong>必须显式关闭</strong>
          <p class="adm-p">只能再次点击触发器才能关闭。常用于表单 popover。</p>
        </template>
      </CfPopover>
      <span class="adm-hint">外部点击 + Esc 均无效</span>
    </div>
  </div>
</template>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 12px; }
.adm-p { margin: 4px 0 0; color: var(--fg-2); }
.adm-hint { color: var(--fg-3); font-size: var(--t-12); }
</style>
