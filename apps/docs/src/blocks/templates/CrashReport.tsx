import { CfCrashPane, CfDropzone, CfBanner, CfButton } from '@chufix-design/react';

export function CrashReport() {
  return (
    <div style={{ height: 320 }}>
      <CfCrashPane
        slots={{
          'panel-dialog': (
            <CfBanner
              tone="error"
              title="应用意外崩溃"
              description="UncaughtTypeError: cannot read property 'foo' of undefined"
              actions={<CfButton variant="danger" size="sm">重启</CfButton>}
            />
          ),
          'panel-stack': (
            <pre style={{ margin: 0, padding: 8, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: '16px', color: 'var(--fg-1)', background: 'var(--bg-2)', borderRadius: 'var(--r-3)', overflowX: 'auto' }}>
{`TypeError: Cannot read property 'foo' of undefined
  at fetchOrders (orders.ts:42:18)
  at handleSubmit (form.ts:18:7)
  at Object.click (button.ts:7:23)
  at HTMLButtonElement.<anonymous> (event.ts:14:9)`}
            </pre>
          ),
          'panel-uploader': <CfDropzone />,
          'panel-safemode': (
            <>
              <CfBanner tone="warning" title="进入安全模式将禁用所有插件" description="只保留核心组件，便于排查冲突。" />
              <div style={{ marginTop: 12 }}>
                <CfButton variant="secondary">进入安全模式</CfButton>
              </div>
            </>
          ),
        }}
      />
    </div>
  );
}
