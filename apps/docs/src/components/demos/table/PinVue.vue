<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Server {
  id: string;
  hostname: string;
  region: string;
  cpu: string;
  memory: string;
  disk: string;
  network: string;
  uptime: string;
  status: string;
}

const rows = ref<Server[]>(
  Array.from({ length: 12 }, (_, i) => ({
    id: `srv-${1000 + i}`,
    hostname: `web-${(i % 3) + 1}.${['us-east', 'eu-west', 'ap-south'][i % 3]}.protoforge.io`,
    region: ['us-east-1', 'eu-west-1', 'ap-south-1'][i % 3],
    cpu: `${30 + ((i * 7) % 60)}%`,
    memory: `${50 + ((i * 11) % 40)}%`,
    disk: `${20 + ((i * 5) % 70)}%`,
    network: `${1 + ((i * 3) % 9)}.${(i * 2) % 9} GB/s`,
    uptime: `${42 + i * 3} 天`,
    status: ['running', 'idle', 'warning'][i % 3],
  })),
);

const columns: TableColumn<Server>[] = [
  { key: 'id', title: 'ID', width: 100, fixed: 'left' },
  { key: 'hostname', title: '主机名', width: 280 },
  { key: 'region', title: 'Region', width: 120 },
  { key: 'cpu', title: 'CPU', width: 90, align: 'right' },
  { key: 'memory', title: '内存', width: 90, align: 'right' },
  { key: 'disk', title: '磁盘', width: 90, align: 'right' },
  { key: 'network', title: '网络', width: 110, align: 'right' },
  { key: 'uptime', title: '在线', width: 90, align: 'right' },
  { key: 'status', title: '状态', width: 100, fixed: 'right' },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    variant="bordered"
    sticky-header
    :height="320"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    左侧 ID 和右侧 状态 列被钉住；中间区域可横向滚动；表头粘在顶部。
  </p>
</template>
