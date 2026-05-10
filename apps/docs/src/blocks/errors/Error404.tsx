import { CfResult, CfButton, CfLink } from '@chufix-design/react';

const artworkStyle = { width: 'min(420px, 100%)', height: 'auto' };

export function Error404() {
  return (
    <div className="err">
      <CfResult
        status="404"
        size="lg"
        title="页面走丢了"
        description="这个地址可能已经移动、被删除，或者你打错了字符。"
        icon={
          <svg className="err-artwork" style={artworkStyle} viewBox="0 0 420 220" role="img" aria-label="404 页面插画">
            <defs>
              <linearGradient id="nf-surface" x1="34" x2="386" y1="24" y2="196" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--bg-1)" />
                <stop offset="100%" stopColor="var(--accent-soft)" />
              </linearGradient>
              <linearGradient id="nf-line" x1="74" x2="344" y1="152" y2="74" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-1)" />
                <stop offset="1" stopColor="var(--status-info)" />
              </linearGradient>
              <filter id="nf-shadow" x="36" y="40" width="340" height="144" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="var(--shadow-color)" floodOpacity=".12" />
              </filter>
            </defs>
            <rect x="34" y="24" width="352" height="172" rx="28" fill="url(#nf-surface)" stroke="var(--line-1)" />
            <path
              d="M80 150 C116 104 156 158 190 118 S258 74 340 84"
              fill="none"
              stroke="url(#nf-line)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="12 12"
            />
            <g filter="url(#nf-shadow)">
              <rect x="68" y="58" width="136" height="92" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
              <rect x="68" y="58" width="136" height="26" rx="18" fill="var(--bg-1)" stroke="var(--line-2)" />
              <circle cx="88" cy="72" r="4.5" fill="var(--fg-3)" />
              <circle cx="104" cy="72" r="4.5" fill="var(--fg-3)" />
              <circle cx="120" cy="72" r="4.5" fill="var(--fg-3)" />
              <rect x="88" y="102" width="76" height="8" rx="4" fill="var(--line-3)" />
              <rect x="88" y="122" width="48" height="8" rx="4" fill="var(--accent-soft)" />
            </g>
            <g filter="url(#nf-shadow)">
              <rect x="250" y="76" width="106" height="92" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
              <text x="303" y="130" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="42" fontWeight="700" fill="var(--accent-1)">404</text>
            </g>
            <g filter="url(#nf-shadow)">
              <rect x="196" y="82" width="64" height="64" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
              <path d="M219 105 c2-13 23-13 23 2 0 12-14 12-14 24" fill="none" stroke="var(--accent-1)" strokeWidth="6" strokeLinecap="round" />
              <circle cx="228" cy="137" r="3.8" fill="var(--accent-1)" />
            </g>
          </svg>
        }
        extra={
          <>
            <div className="err__actions">
              <CfButton variant="primary">返回首页</CfButton>
              <CfButton variant="tertiary">联系支持</CfButton>
            </div>
            <p className="err__links">
              常见入口：<CfLink href="#">所有组件</CfLink> · <CfLink href="#">Blocks</CfLink> · <CfLink href="#">主题与 token</CfLink>
            </p>
          </>
        }
      />
    </div>
  );
}
