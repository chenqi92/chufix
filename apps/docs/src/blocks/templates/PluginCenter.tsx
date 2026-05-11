import { CfPluginPane } from '@chufix-design/react';

export function PluginCenter() {
  return (
    <div style={{ height: 280 }}>
      <CfPluginPane
        slots={{
          'panel-card': <p style={{ color: 'var(--fg-2)' }}>PluginCard 列表 / 网格视图。</p>,
          'panel-manifest': (
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
{`{
  "name": "@chufix-design/plugin-foo",
  "version": "1.0.0",
  "permissions": ["read:requests"]
}`}
            </pre>
          ),
          'panel-permission': <p style={{ color: 'var(--fg-2)' }}>权限申请对话框（CfConfirmDialog 派生）。</p>,
          'panel-marketplace': <p style={{ color: 'var(--fg-2)' }}>插件市场搜索 + 列表 + 详情。</p>,
        }}
      />
    </div>
  );
}
