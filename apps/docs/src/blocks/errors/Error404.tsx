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
              <linearGradient id="nf-panel" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--bg-1)" />
                <stop offset="100%" stopColor="var(--accent-soft)" />
              </linearGradient>
              <linearGradient id="nf-route" x1="72" x2="342" y1="142" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-1)" />
                <stop offset="1" stopColor="var(--status-info)" />
              </linearGradient>
            </defs>
            <rect x="22" y="22" width="376" height="176" rx="22" fill="url(#nf-panel)" stroke="var(--line-1)" />
            <path d="M72 144 C126 92 160 170 206 118 S286 70 344 82" fill="none" stroke="url(#nf-route)" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 12" />
            <g fill="var(--bg-1)" stroke="var(--line-2)">
              <rect x="54" y="54" width="118" height="82" rx="12" />
              <rect x="248" y="78" width="116" height="86" rx="12" />
            </g>
            <g fill="var(--fg-3)">
              <circle cx="74" cy="74" r="4" />
              <circle cx="88" cy="74" r="4" />
              <circle cx="102" cy="74" r="4" />
            </g>
            <path d="M76 102 h68 M76 120 h40" stroke="var(--line-3)" strokeWidth="6" strokeLinecap="round" />
            <text x="286" y="128" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="42" fontWeight="700" fill="var(--accent-1)">404</text>
            <g transform="translate(190 76)">
              <rect width="62" height="62" rx="16" fill="var(--bg-0)" stroke="var(--line-2)" />
              <path d="M22 22 c2-12 22-12 22 2 0 12-14 12-14 23" fill="none" stroke="var(--accent-1)" strokeWidth="5" strokeLinecap="round" />
              <circle cx="31" cy="52" r="3.5" fill="var(--accent-1)" />
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
