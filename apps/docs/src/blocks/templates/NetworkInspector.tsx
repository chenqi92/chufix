import { CfNetworkPane, CfTimingBar, CfStatusCodeBadge, CfDescriptionList } from '@chufix/react';

const r1 = [
  { label: 'DNS', start: 0, end: 8, colorIndex: 6 },
  { label: 'TLS', start: 8, end: 92, colorIndex: 2 },
  { label: 'Wait', start: 92, end: 245, colorIndex: 1 },
  { label: 'Receive', start: 245, end: 312, colorIndex: 3 },
];

const certInfo = [
  { label: 'Common Name', value: 'api.protoforge.io' },
  { label: 'Issuer', value: "Let's Encrypt R3" },
  { label: 'Valid From', value: '2026-04-12' },
  { label: 'Valid To', value: '2026-07-11' },
  { label: 'SHA-256', value: '6a:bf:34:8d:21:99…' },
];

export function NetworkInspector() {
  return (
    <div style={{ height: 320 }}>
      <CfNetworkPane
        slots={{
          'panel-har': (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CfStatusCodeBadge code={200} reason="OK" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>/v1/orders · 312ms</span>
              </div>
              <CfTimingBar phases={r1} />
            </div>
          ),
          'panel-hex': (
            <pre style={{ margin: 0, padding: 8, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: '16px', color: 'var(--fg-1)', background: 'var(--bg-2)', borderRadius: 'var(--r-3)' }}>
{`00000000  47 45 54 20 2f 76 31 2f  6f 72 64 65 72 73 20 48  GET /v1/orders H
00000010  54 54 50 2f 31 2e 31 0d  0a 48 6f 73 74 3a 20 61  TTP/1.1..Host: a
00000020  70 69 2e 70 72 6f 74 6f  66 6f 72 67 65 2e 69 6f  pi.protoforge.io`}
            </pre>
          ),
          'panel-pcap': (
            <p style={{ color: 'var(--fg-2)', fontSize: 13 }}>Wireshark 风格的抓包行，由 PCAPRow 子组件渲染（待实现）。</p>
          ),
          'panel-cert': <CfDescriptionList items={certInfo} />,
          'panel-cookie': (
            <p style={{ color: 'var(--fg-2)', fontSize: 13 }}>域级 cookie 管理（基于 CfDataGrid）。</p>
          ),
        }}
      />
    </div>
  );
}
