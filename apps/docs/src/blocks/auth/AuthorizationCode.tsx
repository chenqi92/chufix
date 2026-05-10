import { useMemo, useState } from 'react';
import { CfBanner, CfButton, CfCard, CfCheckbox, CfDivider, CfInlineCode, CfTag } from '@chufix-design/react';

const initialScopes = [
  { id: 'profile', label: '读取基本资料', desc: '姓名、头像、工作区 ID', checked: true, required: true },
  { id: 'projects', label: '读取项目与部署', desc: '项目列表、环境和最近部署记录', checked: true, required: false },
  { id: 'deploy', label: '触发部署', desc: '允许从 Acme Deploy CLI 发起一次部署', checked: false, required: false },
];

export function AuthorizationCode() {
  const [issued, setIssued] = useState(false);
  const [scopes, setScopes] = useState(initialScopes);
  const selectedCount = useMemo(() => scopes.filter((scope) => scope.checked).length, [scopes]);

  function toggleScope(id: string, checked: boolean) {
    setScopes((items) =>
      items.map((item) => (item.id === id && !item.required ? { ...item, checked } : item)),
    );
  }

  return (
    <div className="oauth">
      <section className="oauth__shell">
        <aside className="oauth__summary" aria-label="应用授权摘要">
          <div className="oauth__logo">A</div>
          <h2>Acme Deploy CLI</h2>
          <p>正在请求访问你的 ChuFix 工作区。</p>
          <div className="oauth__flow">
            <span className="is-done">Client</span>
            <span className="is-active">Consent</span>
            <span>Code</span>
            <span>Token</span>
          </div>
          <dl>
            <div><dt>client_id</dt><dd>acme-deploy-cli</dd></div>
            <div><dt>response_type</dt><dd>code</dd></div>
            <div><dt>redirect_uri</dt><dd>http://127.0.0.1:8145/callback</dd></div>
          </dl>
        </aside>

        <CfCard className="oauth__card">
          <div className="oauth__eyebrow">
            <CfTag tone="primary" variant="soft">OAuth 2.0</CfTag>
            <span>{selectedCount} 个权限范围</span>
          </div>
          <h2>允许 Acme Deploy CLI 访问 ChuFix？</h2>
          <p className="oauth__desc">授权后将跳转到本地回调地址，并签发一次性授权码。</p>
          <CfBanner tone="info" icon={false}>
            回调地址 <CfInlineCode>http://127.0.0.1:8145/callback</CfInlineCode> 已注册在当前应用。
          </CfBanner>
          <div className="oauth__scopes">
            {scopes.map((scope) => (
              <label key={scope.id} className="oauth__scope">
                <CfCheckbox
                  checked={scope.checked}
                  disabled={scope.required}
                  onCheckedChange={(checked) => toggleScope(scope.id, checked)}
                />
                <span>
                  <strong>{scope.label}</strong>
                  <small>{scope.desc}</small>
                </span>
                {scope.required ? <CfTag tone="neutral" variant="outline" size="sm">必选</CfTag> : null}
              </label>
            ))}
          </div>
          <CfDivider />
          {issued ? (
            <div className="oauth__issued">
              <span>授权码已生成</span>
              <CfInlineCode>cf_code_7K29M2Q</CfInlineCode>
            </div>
          ) : null}
          <div className="oauth__actions">
            <CfButton variant="primary" onClick={() => setIssued(true)}>{issued ? '已允许' : '允许访问'}</CfButton>
            <CfButton variant="tertiary">拒绝</CfButton>
          </div>
        </CfCard>
      </section>
    </div>
  );
}
