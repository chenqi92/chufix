<script setup lang="ts">
import { CfButton, modal } from '@chufix-design/vue';

async function onConfirm() {
  const ok = await modal.confirm({
    title: '提交订单？',
    description: '提交后无法撤销。',
    onOk: async () => {
      await new Promise((r) => setTimeout(r, 800));
      // 返回 false 阻止关闭
    },
  });
  if (ok) modal.success({ title: '订单已提交', description: '我们已经发邮件给你确认。' });
}

async function onDanger() {
  const ok = await modal.danger({
    title: '清空回收站？',
    description: '所有 18 个文件将永久删除。',
  });
  if (ok) modal.info({ title: '已清空' });
}

function onAlert() {
  modal.warning({
    title: '余额不足',
    description: '当前 ¥12.00，本次消费 ¥38.00。请先充值。',
  });
}
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <CfButton variant="primary" @click="onConfirm">异步 confirm</CfButton>
    <CfButton variant="danger" @click="onDanger">danger</CfButton>
    <CfButton variant="tertiary" @click="onAlert">warning alert</CfButton>
  </div>
</template>
