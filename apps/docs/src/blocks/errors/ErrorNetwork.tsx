import { useState } from 'react';
import { CfResult, CfButton, CfDescriptionList } from '@chufix-design/react';

const artworkStyle = { width: 'min(420px, 100%)', height: 'auto' };

const debug = [
  { label: 'URL', value: 'https://api.protoforge.io/v1/orders' },
  { label: 'Method', value: 'GET' },
  { label: 'Status', value: '0 (network unreachable)' },
  { label: 'Trace', value: 'a8b2-3914-c012' },
];

export function ErrorNetwork() {
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    setRetrying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRetrying(false);
  }

  return (
    <div className="err">
      <CfResult
        status="500"
        size="lg"
        title="网络异常"
        description="无法连接到服务，请检查你的网络或稍后重试。"
        icon={
          <svg className="err-artwork" style={artworkStyle} viewBox="0 0 420 220" role="img" aria-label="网络异常插画">
            <defs>
              <linearGradient id="net-panel" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--bg-1)" />
                <stop offset="100%" stopColor="var(--accent-soft)" />
              </linearGradient>
              <linearGradient id="net-link" x1="76" x2="344" y1="120" y2="94" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-1)" />
                <stop offset="1" stopColor="var(--status-error)" />
              </linearGradient>
            </defs>
            <rect x="22" y="22" width="376" height="176" rx="22" fill="url(#net-panel)" stroke="var(--line-1)" />
            <path d="M82 132 C128 78 172 86 210 112 S290 154 340 86" fill="none" stroke="url(#net-link)" strokeWidth="5" strokeLinecap="round" strokeDasharray="18 14" />
            <g fill="var(--bg-1)" stroke="var(--line-2)" strokeWidth="2">
              <rect x="52" y="96" width="84" height="64" rx="14" />
              <rect x="168" y="64" width="84" height="64" rx="14" />
              <rect x="284" y="82" width="84" height="64" rx="14" />
            </g>
            <g stroke="var(--line-3)" strokeWidth="6" strokeLinecap="round">
              <path d="M72 118 h42" />
              <path d="M188 86 h42" />
              <path d="M304 104 h42" />
              <path d="M72 138 h26" />
              <path d="M188 106 h30" />
              <path d="M304 124 h24" />
            </g>
            <g transform="translate(194 132)">
              <circle cx="0" cy="0" r="32" fill="var(--bg-0)" stroke="var(--status-error)" strokeWidth="5" />
              <path d="M-12 -12 l24 24 M12 -12 l-24 24" stroke="var(--status-error)" strokeWidth="5" strokeLinecap="round" />
            </g>
            <rect x="140" y="38" width="140" height="30" rx="15" fill="var(--bg-0)" stroke="var(--line-2)" />
            <circle cx="160" cy="53" r="5" fill="var(--status-error)" />
            <text x="174" y="58" fontFamily="var(--font-mono)" fontSize="13" fill="var(--fg-2)">offline endpoint</text>
          </svg>
        }
        extra={
          <>
            <div className="err__actions">
              <CfButton variant="primary" loading={retrying} onClick={retry}>
                {retrying ? '重试中…' : '重试'}
              </CfButton>
              <CfButton variant="tertiary">检测网络</CfButton>
            </div>
            <details className="err__debug">
              <summary>诊断信息</summary>
              <CfDescriptionList items={debug} />
            </details>
          </>
        }
      />
    </div>
  );
}
