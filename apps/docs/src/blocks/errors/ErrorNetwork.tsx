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
              <linearGradient id="net-surface" x1="34" x2="386" y1="24" y2="196" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--bg-1)" />
                <stop offset="100%" stopColor="var(--accent-soft)" />
              </linearGradient>
              <linearGradient id="net-link" x1="70" x2="350" y1="128" y2="86" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-1)" />
                <stop offset="1" stopColor="var(--status-error)" />
              </linearGradient>
              <filter id="net-shadow" x="20" y="24" width="380" height="176" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="var(--shadow-color)" floodOpacity=".12" />
              </filter>
            </defs>
            <rect x="34" y="24" width="352" height="172" rx="28" fill="url(#net-surface)" stroke="var(--line-1)" />
            <path
              d="M112 128 C146 88 184 82 214 108 S278 148 318 84"
              fill="none"
              stroke="url(#net-link)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="14 12"
            />
            <g filter="url(#net-shadow)">
              <rect x="62" y="72" width="124" height="94" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
              <rect x="84" y="92" width="46" height="8" rx="4" fill="var(--accent-soft)" />
              <rect x="84" y="112" width="78" height="8" rx="4" fill="var(--line-3)" />
              <rect x="84" y="132" width="58" height="8" rx="4" fill="var(--line-3)" />
              <circle cx="158" cy="96" r="5" fill="var(--status-success)" />
              <circle cx="158" cy="116" r="5" fill="var(--status-error)" />
              <circle cx="158" cy="136" r="5" fill="var(--status-warning)" />
            </g>
            <g filter="url(#net-shadow)">
              <rect x="266" y="64" width="92" height="112" rx="20" fill="var(--bg-0)" stroke="var(--line-2)" />
              <rect x="288" y="88" width="48" height="10" rx="5" fill="var(--line-3)" />
              <rect x="288" y="112" width="48" height="10" rx="5" fill="var(--line-3)" />
              <rect x="288" y="136" width="34" height="10" rx="5" fill="var(--accent-soft)" />
              <circle cx="336" cy="141" r="6" fill="var(--status-error)" />
            </g>
            <g filter="url(#net-shadow)">
              <circle cx="226" cy="118" r="36" fill="var(--bg-0)" stroke="var(--status-error)" strokeWidth="5" />
              <path d="M212 104 l28 28 M240 104 l-28 28" stroke="var(--status-error)" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g filter="url(#net-shadow)">
              <rect x="126" y="42" width="168" height="32" rx="16" fill="var(--bg-0)" stroke="var(--line-2)" />
              <circle cx="148" cy="58" r="5" fill="var(--status-error)" />
              <text x="164" y="63" fontFamily="var(--font-mono)" fontSize="13" fill="var(--fg-2)">connection lost</text>
            </g>
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
