import { CfProtocolPane, CfTreeView, CfDataGrid, CfList } from '@chufix-design/react';

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

function toneColor(tone?: 'success' | 'warning' | 'info') {
  if (tone === 'success') return 'var(--status-success)';
  if (tone === 'warning') return 'var(--status-warning)';
  if (tone === 'info') return 'var(--status-info)';
  return 'var(--fg-1)';
}

export function ProtocolMonitor() {
  return (
    <div style={{ height: 360 }}>
      <CfProtocolPane
        slots={{
          'panel-sse': (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 12 }}>
              {sseEvents.map((e) => (
                <li key={e.id} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{e.time}</span>
                  <span style={{ color: toneColor(e.tone) }}>●</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{e.title}</span>
                </li>
              ))}
            </ul>
          ),
          'panel-mqtt': <CfTreeView nodes={mqttTopics} />,
          'panel-kafka': <CfDataGrid columns={kafkaCols} rows={kafkaRows} />,
          'panel-grpc': <CfList items={grpcMethods} />,
        }}
      />
    </div>
  );
}
