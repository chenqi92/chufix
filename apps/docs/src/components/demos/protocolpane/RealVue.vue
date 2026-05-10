<script setup lang="ts">
import { CfProtocolPane, CfTimeline, CfTreeView, CfDataGrid, CfStatusCodeBadge, CfList } from '@chufix-design/vue';
const sseEvents = [
  { id: '1', title: 'connection.established', time: '14:32:01', tone: 'success' as const },
  { id: '2', title: 'order.created · #1842', time: '14:32:08' },
  { id: '3', title: 'order.paid · #1842', time: '14:32:14' },
  { id: '4', title: 'heartbeat', time: '14:32:30', tone: 'info' as const },
  { id: '5', title: 'connection.reconnect', time: '14:32:45', tone: 'warning' as const },
];
const mqttTopics = [
  { id: 'sensors', label: 'sensors/', children: [
    { id: 'sensors-temp', label: 'sensors/temp · 14 msg/s' },
    { id: 'sensors-hum', label: 'sensors/humidity · 7 msg/s' },
  ]},
  { id: 'orders', label: 'orders/', children: [
    { id: 'orders-new', label: 'orders/new · 0.3 msg/s' },
    { id: 'orders-paid', label: 'orders/paid · 0.2 msg/s' },
  ]},
];
const kafkaCols = [
  { key: 'partition', title: 'Partition', dataIndex: 'p' },
  { key: 'leader', title: 'Leader', dataIndex: 'l' },
  { key: 'lag', title: 'Lag', dataIndex: 'lag' },
  { key: 'offset', title: 'Offset', dataIndex: 'o' },
];
const kafkaRows = [
  { id: '0', p: '0', l: 'broker-01', lag: 12, o: 184243 },
  { id: '1', p: '1', l: 'broker-02', lag: 0, o: 184510 },
  { id: '2', p: '2', l: 'broker-03', lag: 89, o: 184201 },
  { id: '3', p: '3', l: 'broker-01', lag: 4, o: 184480 },
];
const grpcMethods = [
  { id: '1', label: 'OrderService.GetOrder' },
  { id: '2', label: 'OrderService.CreateOrder' },
  { id: '3', label: 'OrderService.UpdateOrder' },
  { id: '4', label: 'OrderService.ListOrders' },
];
</script>

<template>
  <div style="height: 360px;">
    <CfProtocolPane>
      <template #panel-sse>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 12px;">
          <li v-for="e in sseEvents" :key="e.id" style="display: flex; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--line-1);">
            <span style="color: var(--fg-3); font-family: var(--font-mono);">{{ e.time }}</span>
            <span :style="{ color: e.tone === 'success' ? 'var(--status-success)' : e.tone === 'warning' ? 'var(--status-warning)' : e.tone === 'info' ? 'var(--status-info)' : 'var(--fg-1)' }">●</span>
            <span style="font-family: var(--font-mono);">{{ e.title }}</span>
          </li>
        </ul>
      </template>
      <template #panel-mqtt>
        <CfTreeView :nodes="mqttTopics" />
      </template>
      <template #panel-kafka>
        <CfDataGrid :columns="kafkaCols" :rows="kafkaRows" />
      </template>
      <template #panel-grpc>
        <CfList :items="grpcMethods" />
      </template>
    </CfProtocolPane>
  </div>
</template>
