import { CfResult, CfButton, CfBanner } from '@chufix-design/react';

const artworkStyle = { width: 'min(420px, 100%)', height: 'auto' };

export function Error403() {
  return (
    <div className="err">
      <CfResult
        status="403"
        size="lg"
        title="无访问权限"
        description="当前账号 · jane.l · 没有访问此资源的权限。"
        icon={
          <svg className="err-artwork" style={artworkStyle} viewBox="0 0 420 220" role="img" aria-label="403 权限插画">
            <defs>
              <linearGradient id="forbid-surface" x1="34" x2="386" y1="24" y2="196" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--bg-1)" />
                <stop offset="100%" stopColor="var(--accent-soft)" />
              </linearGradient>
              <linearGradient id="forbid-shield" x1="276" x2="348" y1="72" y2="168" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--status-warning)" />
                <stop offset="1" stopColor="var(--accent-1)" />
              </linearGradient>
              <filter id="forbid-shadow" x="36" y="38" width="340" height="154" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="var(--shadow-color)" floodOpacity=".12" />
              </filter>
            </defs>
            <rect x="34" y="24" width="352" height="172" rx="28" fill="url(#forbid-surface)" stroke="var(--line-1)" />
            <g filter="url(#forbid-shadow)">
              <rect x="66" y="60" width="170" height="112" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
              <circle cx="102" cy="98" r="18" fill="var(--accent-soft)" />
              <rect x="136" y="86" width="58" height="8" rx="4" fill="var(--line-3)" />
              <rect x="136" y="106" width="78" height="8" rx="4" fill="var(--line-3)" />
              <rect x="88" y="136" width="108" height="12" rx="6" fill="var(--bg-2)" stroke="var(--line-2)" />
              <path d="M94 142 h58" stroke="var(--accent-1)" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g filter="url(#forbid-shadow)">
              <path d="M304 54 l64 24 v46 c0 44-34 68-64 82-30-14-64-38-64-82V78z" fill="var(--bg-0)" stroke="var(--line-2)" />
              <path d="M304 70 l46 17 v36 c0 30-22 48-46 60-24-12-46-30-46-60V87z" fill="var(--bg-2)" />
              <rect x="280" y="114" width="48" height="42" rx="11" fill="url(#forbid-shield)" />
              <path d="M290 114 v-14 c0-19 28-19 28 0v14" fill="none" stroke="var(--fg-on-accent, white)" strokeWidth="6" strokeLinecap="round" />
              <circle cx="304" cy="137" r="4" fill="var(--fg-on-accent, white)" />
            </g>
            <g filter="url(#forbid-shadow)">
              <circle cx="232" cy="96" r="28" fill="var(--bg-0)" stroke="var(--status-warning)" strokeWidth="5" />
              <path d="M216 112 L248 80" stroke="var(--status-warning)" strokeWidth="6" strokeLinecap="round" />
            </g>
          </svg>
        }
        extra={
          <>
            <div className="err__banner">
              <CfBanner
                tone="warning"
                title="需要 admin 角色"
                description="联系工作区所有者授予 'team-orders' 的 read 权限即可访问。"
              />
            </div>
            <div className="err__actions">
              <CfButton variant="primary">申请权限</CfButton>
              <CfButton variant="tertiary">切换账号</CfButton>
            </div>
          </>
        }
      />
    </div>
  );
}
