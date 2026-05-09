<script setup lang="ts">
import { CfProtocolPane } from '@chufix/vue';
</script>

<template>
  <div style="height: 280px;">
    <CfProtocolPane>
      <template #panel-sse>
        <p style="color: var(--fg-2);">这里渲染 SSE EventStream 监视器（事件流时间轴 + 重连状态）。</p>
      </template>
      <template #panel-mqtt>
        <p style="color: var(--fg-2);">这里渲染 MQTT TopicTree（订阅树 + 消息列表）。</p>
      </template>
      <template #panel-kafka>
        <p style="color: var(--fg-2);">这里渲染 Kafka PartitionGrid（partition × offset / lag 矩阵）。</p>
      </template>
      <template #panel-grpc>
        <p style="color: var(--fg-2);">这里渲染 gRPC MethodList（service / method 列表 + 调用历史）。</p>
      </template>
    </CfProtocolPane>
  </div>
</template>
