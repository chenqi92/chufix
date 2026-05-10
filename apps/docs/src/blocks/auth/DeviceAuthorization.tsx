import { useMemo, useState } from 'react';
import { CfBanner, CfButton, CfCard, CfProgress, CfTag } from '@chufix-design/react';

export function DeviceAuthorization() {
  const code = 'K9QF-4M2D';
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);
  const progress = useMemo(() => Math.round(((12 * 60 + 18) / (15 * 60)) * 100), []);

  function copyCode() {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="device-auth">
      <section className="device-auth__shell">
        <div className="device-auth__visual" aria-hidden="true">
          <div className="device-auth__halo" />
          <div className="device-auth__device device-auth__device--tv">
            <span className="device-auth__dot" />
            <span className="device-auth__dot" />
            <span className="device-auth__dot" />
            <strong>{code}</strong>
            <small>waiting for browser approval</small>
          </div>
          <div className="device-auth__link"><span /></div>
          <div className="device-auth__device device-auth__device--phone">
            <span className="device-auth__phone-bar" />
            <span className="device-auth__phone-check">✓</span>
            <small>trusted session</small>
          </div>
        </div>

        <CfCard className="device-auth__card">
          <div className="device-auth__eyebrow">
            <CfTag tone="info" variant="soft">Device login</CfTag>
            <span>12:18 后过期</span>
          </div>
          <h2>授权新设备</h2>
          <p className="device-auth__desc">
            你正在为 ChuFix CLI 授权。确认设备屏幕上的代码一致后继续。
          </p>
          <div className="device-auth__code" aria-label="设备授权码">
            {code.split('-').map((part) => <span key={part}>{part}</span>)}
          </div>
          <div className="device-auth__meter">
            <CfProgress value={progress} size="sm" tone="primary" />
            <span>15 分钟有效期</span>
          </div>
          <CfBanner tone="neutral" icon={false}>
            设备：ChuFix CLI · macOS · 上海附近 · 2026-05-10 11:42
          </CfBanner>
          <ol className="device-auth__steps">
            <li>确认设备屏幕显示同一组代码。</li>
            <li>授权后设备只会获得当前工作区的只读令牌。</li>
            <li>如果你没有发起登录，请拒绝并重置当前账号会话。</li>
          </ol>
          <div className="device-auth__actions">
            <CfButton variant="primary" onClick={() => setApproved(true)}>{approved ? '已授权' : '确认授权'}</CfButton>
            <CfButton variant="secondary" onClick={copyCode}>{copied ? '已复制' : '复制代码'}</CfButton>
            <CfButton variant="tertiary">拒绝</CfButton>
          </div>
        </CfCard>
      </section>
    </div>
  );
}
